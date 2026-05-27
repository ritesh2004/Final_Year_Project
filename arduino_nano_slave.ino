// Arduino Nano/Uno SPI Slave Code (AVR-Based)
#include <SPI.h> 
#include <math.h> 

// --- Configuration Anemometer Constants ---
const byte ANEMOMETER_PIN = 3; // Interrupt-capable pin (e.g., Pin D3)
const float ANEMOMETER_RADIUS_M = 0.11; // Radius in meters
const float ANEMOMETER_FACTOR = 2.0;    // Calibration factor


// --- Configuration Rain Gauge Constants ---
#define HALL_PIN 2   // interrupt pin (D2)
const float mmHeight = 0.173;
volatile int tipCount = 0;
float rain = 0.0;

unsigned long lastInterrupt = 0;

// --- Global Variables (Volatile for Interrupts) ---
// SPI variables
volatile byte dataReceived = 0;
volatile boolean dataReady = false;

// Anemometer variables
volatile unsigned long pulseCount = 0; 
unsigned long lastUpdateTime = 0;
float rpm = 0.0;

byte command = 0;

// --- Function Prototypes ---
void countPulse();

// --- Setup ---
void setup() {
  Serial.begin(9600);
  Serial.println("Homemade Anemometer Initialized (AVR Slave)");

  pinMode(ANEMOMETER_PIN, INPUT_PULLUP); 

  // --- AVR SPI Slave Initialization ---
  pinMode(MISO, OUTPUT);        // Slave must set MISO as output
  SPCR |= _BV(SPE);             // Enable SPI (Slave Mode)
  SPCR |= _BV(SPIE);            // Enable SPI Interrupt

  // Note: SCK, MOSI, and SS pins are automatically configured as inputs in slave mode.
  // ------------------------------------

  Serial.println("Arduino Nano Slave Ready");

  // Attach the interrupt for the anemometer sensor
  attachInterrupt(digitalPinToInterrupt(ANEMOMETER_PIN), countPulse, FALLING);
}

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

  }
  else if (command == 0x04){
    byte windByte = (byte)rpm; // send wind speed in rpm
    SPDR = windByte;
  }
  else {
    SPDR = 0;
  }
}

// --- Loop ---
void loop() {
  // Debugging: Print data only when a full SPI transaction completed
  if (dataReady) {
    Serial.print("Slave received command: ");
    Serial.print(dataReceived);
    Serial.print(" | Sent RPM: ");
    Serial.println((byte)rpm); // Print the byte value sent
    dataReady = false;
  }
  
  // Recalculate Wind Speed every 1000 milliseconds (1 second)
  if (millis() - lastUpdateTime >= 1000) {
    // Disable interrupts while reading/resetting the shared volatile variable
    detachInterrupt(digitalPinToInterrupt(ANEMOMETER_PIN));

    // RPM = (Pulses/second) * 60
    rpm = (float)pulseCount * 60.0;
    
    // Output results
    Serial.print("RPM: ");
    Serial.print(rpm);
    
    // Reset counter and update timing
    pulseCount = 0;
    lastUpdateTime = millis();

    // Re-enable interrupts
    attachInterrupt(digitalPinToInterrupt(ANEMOMETER_PIN), countPulse, FALLING);
  }
}

// --- Anemometer Pulse ISR ---
void countPulse() {
  pulseCount++;
}
