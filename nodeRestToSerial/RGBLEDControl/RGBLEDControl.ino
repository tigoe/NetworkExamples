/*
  Serial RGB LED controller
 Context: Arduino

 Controls an RGB LED whose R, G and B legs are
 connected to pins 9, 11, and 10, respectively.
 This is for a common cathode RGB LED.
 The cathode is attached to ground.

 To control it, send a string formatted like so:
 r/255/g/0/b/127
 or r255g0b127

 This was designed to be used with a REST or
 OSC-formatted command string, as shown above.

 created 19 July 2010
 modified 7 Jul 2014
 by Tom Igoe

 */

// constants to hold the output pin numbers:
const int greenPin = 9;
const int bluePin = 10;
const int redPin = 11;

void setup() {
  // initiate serial communication:
  Serial.begin(9600);
  Serial.setTimeout(10);
  // initialize the LED pins as outputs:
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
  pinMode(8, OUTPUT);
  digitalWrite(8, LOW);
  // set the color pins high to turn off the LED:
  digitalWrite(redPin, LOW);
  digitalWrite(greenPin, LOW);
  digitalWrite(bluePin, LOW);

}
void loop() {

  int currentPin = 0; // current pin to be faded

  // if there's any serial data in the buffer, read a byte:
  if (Serial.available() > 0) {
    int inByte = Serial.read();

    // respond to the values 'r', 'g', 'b'.
    // you don't care about any other value:
    switch (inByte) {
      case'r':     // red
        currentPin = redPin;
        break;
      case 'g':    // green
        currentPin = greenPin;

        break;
      case 'b':    // blue
        currentPin = bluePin;
        break;
    }

    // if you have a legitimate pin number,
    // use the parseInt function to listen for a level:
    if (currentPin != 0) {
      int brightness = Serial.parseInt();
      // map the result to a level from 0 to 255
      brightness = map(brightness, 0, 100, 0, 255);

      // set the brightness for this color:
      analogWrite(currentPin, brightness);
      Serial.println(brightness);
    }
  }
}

