/*
  Joystick
 
 Reads a 2-axis joystick with pushbutton from Adafruit.
 Sends the results as a JSON-formatted string like so:
 {"x":"345", "y":"432", "z":"255"}
 
 created 16 Oct 2012
 modified 17 Jun 2014
 by Tom Igoe  
 */

//Set up pins for Adafruit Joystick breakout board:
const int Vin = A0;
const int Gnd = A4;
const int buttonPin = A3;
const int yPin = A2;
const int xPin = A1;

boolean sending = false;

void setup() {
  Serial.begin(9600);
  // initialize power and ground pins for joystick:
  pinMode(Vin, OUTPUT);
  pinMode(Gnd, OUTPUT);
  digitalWrite(Vin, HIGH);
  digitalWrite(Gnd, LOW);
  pinMode(buttonPin, INPUT_PULLUP);
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
    int button = digitalRead(buttonPin);

    // form a JSON-formatted string:
    String jsonString = "{\"x\":\"";
    jsonString += x;
    jsonString +="\",\"y\":\"";
    jsonString += y;
    jsonString +="\",\"z\":\"";
    jsonString += button*255;
    jsonString +="\"}";

    // print it:
    Serial.println(jsonString);
  }
}



