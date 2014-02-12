/*
  AnalogReadSerial
  Reads an analog input on pin 0, prints the result to the serial monitor.
  Attach the center pin of a potentiometer to pin A0, and the outside pins to +5V and ground.

 This example code is in the public domain.
 */

// the setup routine runs once when you press reset:
void setup() {
  // initialize serial communication at 9600 bits per second:
  Serial.begin(9600);
  // set serial receive timeout to 10ms:
  Serial.setTimeout(10);
}

// the loop routine runs over and over again forever:
void loop() {
  // while there's serial data coming in, parse for a number:
  while (Serial.available()) {
     int ledState = Serial.parseInt();
     // set  the built-in LED using the number (1 or 0):
    digitalWrite(13, ledState);
  }
  // read the input on analog pin 0:
  int sensorValue = analogRead(A0);
  // print out the value you read:
  Serial.println(sensorValue);
  delay(1);        // delay in between reads for stability
}
