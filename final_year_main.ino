// ESP32 SPI Master Code
#include <SPI.h>

// For DHT and BMP280
#include <Wire.h>
#include <Adafruit_BMP280.h>
#include <Adafruit_Sensor.h>

#include <DHT.h>
#include <DHT_U.h>

#include<Adafruit_GFX.h>
#include<Adafruit_SH110X.h>

#include <WiFi.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>

#define DHTPIN 4        // DHT11 connected to Digital Pin 4
#define DHTTYPE DHT11   // DHT 11 sensor

// LDR Sensor Pin
#define LDR_PIN 15   // You connected LDR to GPIO15 (PWM pin 15)

DHT dht(DHTPIN, DHTTYPE);
Adafruit_BMP280 bmp; // I2C by default

#define i2c_add 0x3C

// --- Configuration ---
// Define SPI Pins for the ESP32 (VSPI)
#define SCK_PIN 18  // Serial Clock
#define MISO_PIN 19 // Master In, Slave Out
#define MOSI_PIN 23 // Master Out, Slave In
#define SS_PIN 5    // Slave Select (Chip Select)

const char* ssid = "Motorolag54"; // Replace with your WiFi SSID
const char* password = "24246262"; // Replace with your WiFi password

// MQTT
#define MQTT_BROKER "d85b561d6bee461aa99610ea09619324.s1.eu.hivemq.cloud"
#define MQTT_PORT 8883
#define MQTT_USER "final_year_project"
#define MQTT_PASSWORD "Final_year_project26"
#define MQTT_TOPIC "sensor/data"

// Define SPI Settings (Must match the slave)
// Arduino Uno/Nano default max speed is 4MHz. We use 1MHz for safety.
SPISettings settings(1000000, MSBFIRST, SPI_MODE0); 

// OLED
Adafruit_SH1106G display(128,64,&Wire,-1);

// MQTT Setup
WiFiClientSecure espClient;
// WiFiClient espClient;
PubSubClient mqttClient(espClient);

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  Serial.println(message);

  // Control LED based on message
  if (String(topic) == MQTT_TOPIC) {
    Serial.print("Received command: ");
    Serial.println(message);
  }
}

void reconnect() {
  while (!mqttClient.connected()) {
    Serial.print("Attempting MQTT connection...");
    
    // Create a random client ID
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);

    if (mqttClient.connect(clientId.c_str(), MQTT_USER, MQTT_PASSWORD)) {
      Serial.println("connected");
      
      // Subscribe to control topic
      mqttClient.subscribe(MQTT_TOPIC);
      Serial.print("Subscribed to: ");
      Serial.println(MQTT_TOPIC);

    } else {
      Serial.print("failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);

  // Init DHT
  dht.begin();
  Serial.println("DHT11 Starting...");

  // Initialize the SPI bus with specified pins
  SPI.begin(SCK_PIN, MISO_PIN, MOSI_PIN, SS_PIN); 
  
  // Configure the SS pin as output and set high (inactive)
  pinMode(SS_PIN, OUTPUT);
  digitalWrite(SS_PIN, HIGH);

  // Init BMP280
  if (!bmp.begin(0x76)) {   // Try 0x76 or 0x77 depending on module
    Serial.println("Could not find BMP280!");
    while (1);
  }

  Serial.println("BMP280 OK");

  Serial.println("ESP32 Master Ready: Sending requests...");

  setup_wifi();
  
  espClient.setInsecure(); // Use this for testing, but consider using a valid certificate in production
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  // mqttClient.setCallback(callback);
  reconnect();
  // connectMQTT();

  // OLED config
  display.begin(i2c_add,true);
  display.clearDisplay();
}

void loop() {
  // Clear display
  display.clearDisplay();
  // --- DHT11 Read ---
  float h = dht.readHumidity();
  float t_dht = dht.readTemperature();

  // Check for read errors
  if (isnan(h) || isnan(t_dht)) {
    Serial.println("Failed to read from DHT11!");
  }

  // --- BMP280 Read ---
  float t_bmp = bmp.readTemperature();
  float p = bmp.readPressure() / 100.0; // hPa

  // ---- LDR Sensor Read ----
  int ldrValue = analogRead(LDR_PIN);  // Range 0–1023
  float Lumens = 500.0 / pow((ldrValue / 1000.0), 1.4) || 0.0;

  
  // Master sends a command byte (e.g., 0x01 to request data)
  byte commandByte = 0x01; 
  
  // The slave will send back a byte representing the wind speed (integer part).
  byte receivedByte; 

  // --- SPI Transaction ---
  SPI.beginTransaction(settings); 
  digitalWrite(SS_PIN, LOW);             // Select slave

  // Transfer the command and receive the data simultaneously
  receivedByte = SPI.transfer(commandByte); 

  digitalWrite(SS_PIN, HIGH);            // Release slave
  SPI.endTransaction();

  // Convert the received byte (integer km/h) back to a float for printing
  float windSpeed_kmh = (float)receivedByte;

  Serial.print("Master Sent Command: ");
  Serial.print(commandByte, HEX);
  Serial.print(" | Received Wind Speed: ");
  Serial.print(windSpeed_kmh, 2);
  Serial.println(" km/h");

  // --- Output ---
  Serial.println("----- Sensor Data -----");
  Serial.print("DHT11 Temp: ");
  Serial.print(t_dht);
  Serial.println(" *C");

  Serial.print("DHT11 Humidity: ");
  Serial.print(h);
  Serial.println(" %");

  Serial.print("BMP280 Temp: ");
  Serial.print(t_bmp);
  Serial.println(" *C");

  Serial.print("Pressure: ");
  Serial.print(p);
  Serial.println(" hPa");

  Serial.print("LDR Value: ");
  Serial.print(Lumens);
  Serial.println(" lm");

  Serial.println("------------------------");

  if (!mqttClient.connected()) {
    reconnect();
  }
  mqttClient.loop();

  // publish to MQTT Broker
  String payload = "{\"temperature\": " + String(t_dht) + ", \"humidity\": " + String(h) + ", \"atmosphericPressure\": " + String(p) + ", \"windspeed\" : " + String(windSpeed_kmh) + ", \"radiation\" : " + String(Lumens) + "}";
  mqttClient.publish(MQTT_TOPIC, payload.c_str());

  display.setTextSize(1);
  display.setTextColor(SH110X_WHITE);
  display.setCursor(0, 0);
  display.print("Temp: ");
  display.println(t_dht);
  display.print("Hum: ");
  display.println(h);
  display.print("WS: ");
  display.println(windSpeed_kmh, 2);
  display.print("Rad: ");
  display.println(Lumens);
  display.print("Atm: ");
  display.println(p);
  display.display();

  delay(1000); // Request every second
}
