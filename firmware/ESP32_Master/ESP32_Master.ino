#include <SPI.h>

// Sensors
#include <Wire.h>
#include <Adafruit_BMP280.h>
#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

#include <Adafruit_GFX.h>
#include <Adafruit_SH110X.h>

// WiFi + MQTT
#include <WiFi.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>

// ---------------- DHT ----------------

#define DHTPIN 4
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

// ---------------- BMP280 ----------------

Adafruit_BMP280 bmp;

// ---------------- OLED ----------------

#define I2C_ADD 0x3C
Adafruit_SH1106G display(128,64,&Wire,-1);

// ---------------- LDR ----------------

#define LDR_PIN 34

int ldrValue = 0;

// ---------------- SPI ----------------

#define SCK_PIN 18
#define MISO_PIN 19
#define MOSI_PIN 23
#define SS_PIN 5

SPIClass spi = SPIClass(VSPI);

SPISettings settings(1000000, MSBFIRST, SPI_MODE0);

// ---------------- WiFi ----------------

const char* ssid = "Rittik";
const char* password = "c#Ar@CtEr";

// ---------------- MQTT ----------------

#define MQTT_BROKER "d85b561d6bee461aa99610ea09619324.s1.eu.hivemq.cloud"
#define MQTT_PORT 8883
#define MQTT_USER "final_year_project"
#define MQTT_PASSWORD "Final_year_project26"
#define MQTT_TOPIC "sensor/data"

WiFiClientSecure espClient;
PubSubClient mqttClient(espClient);

// ---------------- Rain ----------------

const float rainMM = 0.173;

// ---------------- WiFi ----------------

void setup_wifi() {

  Serial.print("Connecting WiFi");

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {

    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi Connected");
}

// ---------------- MQTT ----------------

void reconnect() {

  while (!mqttClient.connected()) {

    Serial.print("Connecting MQTT...");

    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);

    if (mqttClient.connect(
          clientId.c_str(),
          MQTT_USER,
          MQTT_PASSWORD
        )) {

      Serial.println("Connected");
    }
    else {

      Serial.println("Retrying...");
      delay(5000);
    }
  }
}

// ---------------- SPI READ FUNCTION ----------------

byte spiRead(byte command) {

  byte received;

  spi.beginTransaction(settings);

  digitalWrite(SS_PIN, LOW);

  // Send command
  spi.transfer(command);

  // Read actual response
  received = spi.transfer(0x00);

  digitalWrite(SS_PIN, HIGH);

  spi.endTransaction();

  return received;
}

// ---------------- SETUP ----------------

void setup() {

  Serial.begin(115200);

  pinMode(LDR_PIN, INPUT);

  dht.begin();

  // SPI
  spi.begin(SCK_PIN, MISO_PIN, MOSI_PIN, SS_PIN);

  pinMode(SS_PIN, OUTPUT);

  digitalWrite(SS_PIN, HIGH);

  // BMP280
  if (!bmp.begin(0x76)) {

    Serial.println("BMP280 not found");

    while (1);
  }

  // OLED
  display.begin(I2C_ADD,true);
  display.clearDisplay();

  // WiFi
  setup_wifi();

  // MQTT
  espClient.setInsecure();

  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);

  reconnect();

  Serial.println("ESP32 Master Ready");
}

// ---------------- LOOP ----------------

void loop() {

  display.clearDisplay();

  // -------- DHT --------

  float humidity = dht.readHumidity();
  float temp = dht.readTemperature();

  // -------- BMP280 --------

  float pressure = bmp.readPressure()/100.0;

  // -------- LDR --------

  ldrValue = analogRead(LDR_PIN);

  float radiation =
  500.0 / pow((ldrValue / 1000.0), 1.4);

  // -------- SPI SENSOR READS --------

  float windSpeed = (float)spiRead(0x04);

  int tips = spiRead(0x02);

  float rainfall = tips * rainMM;

  // -------- SERIAL OUTPUT --------

  Serial.println("----- Weather Data -----");

  Serial.print("Temp: ");
  Serial.println(temp);

  Serial.print("Humidity: ");
  Serial.println(humidity);

  Serial.print("Pressure: ");
  Serial.println(pressure);

  Serial.print("Wind Speed: ");
  Serial.println(windSpeed);

  Serial.print("Rainfall: ");
  Serial.println(rainfall);

  Serial.print("Radiation: ");
  Serial.println(radiation);

  Serial.println("------------------------");

  // -------- MQTT --------

  if (!mqttClient.connected()) reconnect();

  mqttClient.loop();

  String payload =
  "{"
  "\"temperature\":" + String(temp) +
  ",\"humidity\":" + String(humidity) +
  ",\"atmosphericPressure\":" + String(pressure) +
  ",\"windspeed\":" + String(windSpeed) +
  ",\"rainfall\":" + String(rainfall) +
  ",\"radiation\":" + String(radiation) +
  "}";

  mqttClient.publish(MQTT_TOPIC, payload.c_str());

  // -------- OLED --------

  display.setTextSize(1);

  display.setTextColor(SH110X_WHITE);

  display.setCursor(0,0);

  display.print("Temp: ");
  display.print(temp);
  display.println(" C");

  display.print("Hum: ");
  display.print(humidity);
  display.println(" %");

  display.print("Wind: ");
  display.print(windSpeed);
  display.println(" km/h");

  display.print("Rain: ");
  display.print(rainfall);
  display.println(" mm");

  display.print("Radiation: ");
  display.println(radiation);

  display.print("Atm: ");
  display.print(pressure);
  display.println(" hPa");

  display.display();

  delay(2000);
}