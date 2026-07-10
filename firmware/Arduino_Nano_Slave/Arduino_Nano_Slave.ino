#include <SPI.h>
#include <math.h>

// ---------------- ANEMOMETER ----------------

const byte ANEMOMETER_PIN = 3;

const float ANEMOMETER_RADIUS_M = 0.11;
const float ANEMOMETER_FACTOR = 2.0;

// ---------------- RAIN GAUGE ----------------

#define HALL_PIN 2

const float mmHeight = 0.173;

// ---------------- VARIABLES ----------------

// Rain
volatile unsigned int tipCount = 0;

unsigned long lastRainInterrupt = 0;

// Wind
volatile unsigned long pulseCount = 0;

unsigned long lastUpdateTime = 0;

float rpm = 0.0;

float windSpeed_kmh = 0.0;

// SPI Data Bytes
volatile byte windByte = 0;
volatile byte rainByte = 0;

// SPI
volatile byte command = 0;

// ---------------- RAIN ISR ----------------

void bucketTipped() {

  unsigned long now = millis();

  // Debounce
  if(now - lastRainInterrupt > 50) {

    tipCount++;

    lastRainInterrupt = now;
  }
}

// ---------------- ANEMOMETER ISR ----------------

void countPulse() {

  pulseCount++;
}

// ---------------- SPI ISR ----------------

ISR (SPI_STC_vect) {

  command = SPDR;

  // Rain Data Request
  if(command == 0x02) {

    SPDR = rainByte;
  }

  // Wind Data Request
  else if(command == 0x04) {

    SPDR = windByte;
  }

  else {

    SPDR = 0;
  }
}

// ---------------- SETUP ----------------

void setup() {

  Serial.begin(9600);

  Serial.println("Nano SPI Slave Ready");

  // -------- Rain Gauge --------

  pinMode(HALL_PIN, INPUT_PULLUP);

  attachInterrupt(
    digitalPinToInterrupt(HALL_PIN),
    bucketTipped,
    FALLING
  );

  // -------- Anemometer --------

  pinMode(ANEMOMETER_PIN, INPUT_PULLUP);

  attachInterrupt(
    digitalPinToInterrupt(ANEMOMETER_PIN),
    countPulse,
    FALLING
  );

  // -------- SPI Slave --------

  pinMode(MISO, OUTPUT);

  SPCR |= _BV(SPE);   // Enable SPI

  SPCR |= _BV(SPIE);  // Enable SPI Interrupt

  SPDR = 0;

  Serial.println("SPI Ready");
}

// ---------------- LOOP ----------------
void loop() {

  // Update every 1 second
  if(millis() - lastUpdateTime >= 1000) {

    noInterrupts();

    unsigned long count = pulseCount;

    pulseCount = 0;

    interrupts();

    // -------- RPM --------

    rpm = count * 60.0;

    // -------- Wind Speed Calculation --------

    windSpeed_kmh =
    (
      (2 * PI * ANEMOMETER_RADIUS_M * rpm)
      / 1000.0
    )
    * 3.6
    * ANEMOMETER_FACTOR;

    // Remove false low-speed noise
    // if(windSpeed_kmh < 5.0) {

    //   windSpeed_kmh = 0;
    // }

    // -------- Rainfall --------

    float rainfall = tipCount * mmHeight;

    // -------- Update SPI Bytes --------

    windByte = (byte)windSpeed_kmh;

    rainByte = (byte)tipCount;

    // -------- SERIAL DEBUG --------

    Serial.print("RPM: ");
    Serial.print(rpm);

    Serial.print(" | Wind: ");
    Serial.print(windSpeed_kmh);
    Serial.print(" km/h");

    Serial.print(" | Tips: ");
    Serial.print(tipCount);

    Serial.print(" | Rain: ");
    Serial.print(rainfall);
    Serial.println(" mm");

    lastUpdateTime = millis();
  }
}