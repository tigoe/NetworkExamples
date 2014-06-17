/*
  AsciiSerialRead
  Reads an ASCII string from the incoming serial stream
  and uses the value to set the brightness of an LED on pin 9
  using analogWrite().
  
 This example code is in the public domain.
 */

// the setup routine runs once when you press reset:
void setup() {
  // initialize serial communication at 9600 bits per second:
  Serial.begin(9600);
  // set serial receive timeout to 10ms:
  Serial.setTimeout(10);
  pinMode(9, OUTPUT);
}

// the loop routine runs over and over again forever:
void loop() {
  // while there's serial data coming in, parse for a number:
  while (Serial.available()) {
    int ledState = Serial.parseInt();
    // set  the built-in LED using the number (0 - 255):
    analogWrite(9, ledState);
  }
}
