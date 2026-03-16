#include <Wire.h>
#include <SPI.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SH110X.h>

#define I2C_ADD 0x3C
#define HALL_PIN 2   // interrupt pin (D2)

Adafruit_SH1106G display(128,64,&Wire,-1);

const float mmHeight = 0.173;

volatile int tipCount = 0;
float rain = 0;

unsigned long lastInterrupt = 0;
byte command = 0;

// -------- RAIN INTERRUPT --------
void bucketTipped() {

  unsigned long now = millis();

  if(now - lastInterrupt > 50){
    tipCount++;
    lastInterrupt = now;
  }
}

// -------- SPI INTERRUPT --------
ISR (SPI_STC_vect) {

  command = SPDR;   // receive command from ESP32

  if(command == 0x02) {

    byte rainByte = (byte)tipCount; // send rain tips
    SPDR = rainByte;

  } else {

    SPDR = 0;
  }
}

void setup() {

  Serial.begin(115200);

  pinMode(HALL_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(HALL_PIN), bucketTipped, FALLING);

  // ---- SPI SLAVE SETUP ----
  pinMode(MISO, OUTPUT);
  SPCR |= _BV(SPE);      // enable SPI
  SPI.attachInterrupt();

  display.begin(I2C_ADD, true);
  display.clearDisplay();

  Serial.println("Rain Gauge SPI Slave Ready");
}

void loop() {

  rain = tipCount * mmHeight;

  Serial.print("Tips: ");
  Serial.print(tipCount);
  Serial.print("  Rain: ");
  Serial.print(rain);
  Serial.println(" mm");

  display.clearDisplay();
  display.setCursor(0,0);
  display.setTextSize(1);
  display.setTextColor(SH110X_WHITE);

  display.print("Rain: ");
  display.print(rain);
  display.println(" mm");

  display.display();

  delay(500);
}
