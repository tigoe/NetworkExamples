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

int currentPin = 0; // current pin to be faded
int brightness = 0; // current brightness level

void setup() {
  // initiate serial communication:
  Serial.begin(9600);

  // initialize the LED pins as outputs:
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
  pinMode(cathode, OUTPUT);
  digitalWrite(cathode, LOW);
}
void loop() {
  int brightnesss =0;
  // if there's any serial data in the buffer, read a byte:
  if (Serial.available() > 0) {
    int inByte = Serial.read(); 

    // respond to the values 'r', 'g', 'b'.
    // you don't care about any other value:
    switch (inByte) {
    case'r':
      currentPin = redPin; 
      break;
    case 'g':
      currentPin = greenPin; 

      break;
    case 'b':
      currentPin = bluePin; 
      break;
    case '/':
      break;
    case '\r':
    case '\n':
      Serial.flush();
      break;
    }

    if (currentPin != 0){
      Serial.println(currentPin);
      brightness = Serial.parseInt();
      Serial.println(brightness);
    }
    
    analogWrite(currentPin, brightness);    
    currentPin = 0;
  }
}







