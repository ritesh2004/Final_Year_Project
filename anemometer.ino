// Arduino Nano/Uno SPI Slave Code (AVR-Based)
#include <SPI.h> 
#include <math.h> 

// --- Configuration Constants ---
const byte ANEMOMETER_PIN = 3; // Interrupt-capable pin (e.g., Pin D3)
const float ANEMOMETER_RADIUS_M = 0.11; // Radius in meters
const float ANEMOMETER_FACTOR = 2.0;    // Calibration factor

// --- Global Variables (Volatile for Interrupts) ---
// SPI variables
volatile byte dataReceived = 0;
volatile boolean dataReady = false;

// Anemometer variables
volatile unsigned long pulseCount = 0; 
unsigned long lastUpdateTime = 0;
float rpm = 0.0;
volatile float windSpeed_kmh = 0.0; // Use volatile as it's modified in loop() and read in ISR

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

// SPI Interrupt Service Routine (Runs when Master transfers a byte)
ISR(SPI_STC_vect) {
  // 1. Read the command/data sent by the Master
  dataReceived = SPDR; 

  // 2. Load the reply byte (the current wind speed, truncated to an integer byte)
  // Casting a float to a byte truncates the decimal part.
  SPDR = (byte)windSpeed_kmh; 

  // 3. Flag that a transaction occurred (for debugging/serial print in loop)
  dataReady = true;
}

// --- Loop ---
void loop() {
  // Debugging: Print data only when a full SPI transaction completed
  if (dataReady) {
    Serial.print("Slave received command: ");
    Serial.print(dataReceived);
    Serial.print(" | Sent Wind Speed: ");
    Serial.println((byte)windSpeed_kmh); // Print the byte value sent
    dataReady = false;
  }
  
  // Recalculate Wind Speed every 1000 milliseconds (1 second)
  if (millis() - lastUpdateTime >= 1000) {
    // Disable interrupts while reading/resetting the shared volatile variable
    detachInterrupt(digitalPinToInterrupt(ANEMOMETER_PIN));

    // RPM = (Pulses/second) * 60
    rpm = (float)pulseCount * 60.0;
    
    // Constant Factor: (2 * PI * 60) / 1000 
    const float CONSTANT_FACTOR = (2.0 * PI * 60.0) / 1000.0;
    
    // Cup speed in km/h
    float cupSpeed_kmh = CONSTANT_FACTOR * ANEMOMETER_RADIUS_M * rpm; 

    // Apply the Anemometer Factor
    windSpeed_kmh = cupSpeed_kmh * ANEMOMETER_FACTOR; // Update the volatile variable

    // Output results
    Serial.print("RPM: ");
    Serial.print(rpm);
    Serial.print(" | Wind Speed: ");
    Serial.print(windSpeed_kmh, 2); 
    Serial.println(" km/h");
    
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
