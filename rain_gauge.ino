#include <SPI.h>

#define HALL_PIN 2   // interrupt pin (D2)

const float mmHeight = 0.173;

volatile int tipCount = 0;
float rain = 0;

unsigned long lastInterrupt = 0;
volatile byte command = 0;
volatile boolean dataReady = false;

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

  byte rainByte = (byte)tipCount; // send rain tips
  SPDR = rainByte;
  dataReady = true;
  
}

void setup() {

  Serial.begin(115200);

  pinMode(HALL_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(HALL_PIN), bucketTipped, FALLING);

  // ---- SPI SLAVE SETUP ----
  pinMode(MISO, OUTPUT);
  pinMode(SS, INPUT);

  SPCR |= _BV(SPE);      // enable SPI
  SPCR |= _BV(SPIE);            // Enable SPI Interrupt

  SPDR = 15;
  Serial.println("Rain Gauge SPI Slave Ready");
}

void loop() {

  // Debugging: Print data only when a full SPI transaction completed
  if (dataReady) {
    Serial.print("Slave received command: ");
    Serial.print(command);
    Serial.print(" | Sent tip count: ");
    Serial.println((byte)tipCount); // Print the byte value sent
    dataReady = false;
  }

  rain = tipCount * mmHeight;

  Serial.print("Tips: ");
  Serial.print(tipCount);
  Serial.print("  Rain: ");
  Serial.print(rain);
  Serial.println(" mm");

  delay(500);
}
