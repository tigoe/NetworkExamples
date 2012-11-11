/*
  Serial RGB LED controller
 Context: Arduino
 
 Controls an RGB LED whose R, G and B legs are 
 connected to pins 11, 9, and 10, respectively.
 
 To control it, type 'r', 'g', or 'b' followed by
 the numerals 0 through 9. Each LED can be set at a brightness level 
 from 0 to 9.
 
 created 19 July 2010
 modified 5 Nov 2012
 by Tom Igoe
 
 */

// constants to hold the output pin numbers:
const int greenPin = 11;
const int cathode = 8;
const int bluePin = 10;
const int redPin = 9;

void setup() {
  // initiate serial communication:
  Serial.begin(9600);

  // initialize the LED pins as outputs:
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
  // use the cathode pin as ground and set it low:
  pinMode(cathode, OUTPUT);
  digitalWrite(cathode, LOW);
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
    case '/':    // ignore the slashes
      break;
    case '\r':   // if you get a return or newline, flush the serial buffer
    case '\n':
      Serial.flush();
      break;
    }
    
    // if you have a legitimage pin number, you should get a level next.
    // use the parseInt function to listen for it:
    if (currentPin != 0){
      int brightness = Serial.parseInt();
      // map the result to a level from 0 to 255:
      brightness = map(brightness, 0, 100, 0, 255);
      // set the brightness for this color:
      analogWrite(currentPin, brightness);    
    }
    currentPin = 0;
  }
}








