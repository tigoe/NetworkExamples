/*
  ADXL326
 
 Reads an ADXL326 3-axis accelerometer from Adafruit.
 Sends the results as a JSON-formatted string like so:
 {"x":"345", "y":"432", "z":"234"}
 
 created 16 Oct 2012
 by Tom Igoe  
 */

//Set up pins for Adafruit ADXL326 breakout board:
const int Vin = A0;
const int Gnd = A2;
const int zPin = A3;
const int yPin = A4;
const int xPin = A5;

boolean sending = false;

void setup() {
  Serial.begin(9600);
  // initialize power and ground pins for accelerometer:
  pinMode(Vin, OUTPUT);
  pinMode(Gnd, OUTPUT);
  digitalWrite(Vin, HIGH);
  digitalWrite(Gnd, LOW);
}

void loop() {
  // read for incoming messages. c = send, x = don't send:
  char inChar = Serial.read();
  switch (inChar) {
  case 'c':    // connection open
    sending = true;
    break;
  case 'x':    // connection closed
    sending = false;
    break;
  }

  if (sending) {
    // read sensors:
    int x = analogRead(xPin);
    delay(1);
    int y = analogRead(yPin);
    delay(1);
    int z = analogRead(zPin);

    // form a JSON-formatted string:
    String jsonString = "{\"x\":\"";
    jsonString += x;
    jsonString +="\",\"y\":\"";
    jsonString += y;
    jsonString +="\",\"z\":\"";
    jsonString += z;
    jsonString +="\"}";

    // print it:
    Serial.println(jsonString);
  }
}



