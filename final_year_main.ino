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

#define DHTPIN 4
#define DHTTYPE DHT11

#define LDR_PIN 15

DHT dht(DHTPIN, DHTTYPE);
Adafruit_BMP280 bmp;

#define I2C_ADD 0x3C

// SPI pins
#define SCK_PIN 18
#define MISO_PIN 19
#define MOSI_PIN 23
#define SS_PIN 5

SPISettings settings(1000000, MSBFIRST, SPI_MODE0);

// OLED
Adafruit_SH1106G display(128,64,&Wire,-1);

// WiFi
const char* ssid = "Motorolag54";
const char* password = "24246262";

// MQTT
#define MQTT_BROKER "d85b561d6bee461aa99610ea09619324.s1.eu.hivemq.cloud"
#define MQTT_PORT 8883
#define MQTT_USER "final_year_project"
#define MQTT_PASSWORD "Final_year_project26"
#define MQTT_TOPIC "sensor/data"

WiFiClientSecure espClient;
PubSubClient mqttClient(espClient);

const float rainMM = 0.173;

void setup_wifi() {

  Serial.print("Connecting WiFi");

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi Connected");
}

void reconnect() {

  while (!mqttClient.connected()) {

    Serial.print("Connecting MQTT...");

    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);

    if (mqttClient.connect(clientId.c_str(), MQTT_USER, MQTT_PASSWORD)) {
      Serial.println("Connected");
    }
    else {
      Serial.println("Retrying...");
      delay(5000);
    }
  }
}

void setup() {

  Serial.begin(115200);

  dht.begin();

  SPI.begin(SCK_PIN, MISO_PIN, MOSI_PIN, SS_PIN);

  pinMode(SS_PIN, OUTPUT);
  digitalWrite(SS_PIN, HIGH);

  if (!bmp.begin(0x76)) {
    Serial.println("BMP280 not found");
    while (1);
  }

  display.begin(I2C_ADD,true);
  display.clearDisplay();

  setup_wifi();

  espClient.setInsecure();

  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);

  reconnect();

  Serial.println("ESP32 Master Ready");
}

void loop() {

  display.clearDisplay();

  // DHT
  float humidity = dht.readHumidity();
  float temp = dht.readTemperature();

  // BMP280
  float pressure = bmp.readPressure()/100.0;

  // LDR
  int ldrValue = analogRead(LDR_PIN);
  float radiation = 500.0 / pow((ldrValue / 1000.0), 1.4);

  // -------- WIND SPEED --------
  byte command = 0x01;
  byte received;

  SPI.beginTransaction(settings);

  digitalWrite(SS_PIN, LOW);
  received = SPI.transfer(command);
  digitalWrite(SS_PIN, HIGH);

  SPI.endTransaction();

  float windSpeed = (float)received;

  // -------- RAIN GAUGE --------
  command = 0x02;

  SPI.beginTransaction(settings);

  digitalWrite(SS_PIN, LOW);
  received = SPI.transfer(command);
  digitalWrite(SS_PIN, HIGH);

  SPI.endTransaction();

  int tips = received;
  float rainfall = tips * rainMM;
  Serial.println(tips);

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

  if (!mqttClient.connected()) reconnect();

  mqttClient.loop();

  // MQTT Payload
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

  // OLED DISPLAY
  display.setTextSize(1);
  display.setTextColor(SH110X_WHITE);
  display.setCursor(0,0);

  display.print("Temp: ");
  display.println(temp);

  display.print("Hum: ");
  display.println(humidity);

  display.print("Wind: ");
  display.println(windSpeed);

  display.print("Rain: ");
  display.println(rainfall);

  display.print("Atm: ");
  display.println(pressure);

  display.display();

  delay(1000);
}
