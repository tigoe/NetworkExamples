/*
  Bridge Joystick client
  Language:  Arduino
 
  This program enables an Arduino to control one paddle 
  in a networked Pong game. It uses an Arduino Yun and the
  Bridge library

 created 20 Jun 2012
 modified 8 Sept 2014
 by Tom Igoe
 */


#include <Process.h>

Process telnet;

const int connectButton = A3; // the pushbutton for connecting/disconnecting
const int connectionLED = 3;  // this LED indicates whether you're connected
const int leftLED = 5;        // this LED indicates that you're moving left
const int rightLED = 6;       // this LED indicates that you're moving right
const int upLED = 8;          // this LED indicates that you're moving uo
const int downLED = 9;        // this LED indicates that you're moving down

const int sendInterval = 50;      // minimum time between messages to the server
const int debounceInterval = 15;  // used to smooth out pushbutton readings

int lastButtonState = 0;     // previous state of the pushbutton
long lastTimeSent = 0;       // timestamp of the last server message


void setup() {
  Bridge.begin();	// Initialize the Bridge
  Serial.begin(9600);	// Initialize the Serial

  // initialize digital inputs and outputs:
  pinMode(connectButton, INPUT);
  pinMode(connectionLED, OUTPUT);
  pinMode(leftLED, OUTPUT);
  pinMode(rightLED, OUTPUT);
  pinMode(upLED, OUTPUT);
  pinMode(downLED, OUTPUT);

  // configure analog pins for Adafruit joystick:
  pinMode(A0, OUTPUT);
  pinMode(A4, OUTPUT);
  pinMode(A3, INPUT_PULLUP);    // joystick pushbutton
  // turn on A0 for +v connection of joystick:
  digitalWrite(A0, HIGH);
  // turn off A4 for gnd connection of joystick:
  digitalWrite(A4, LOW);

}

void loop() {

  // If the process is running, listen for serial input:
  if(telnet.running()) {
    if (Serial.available() > 0) {
      char c = Serial.read();    // read serial in
      telnet.write(c);           // send it to the telnet process
      Serial.write(c);           // echo it back locally
    } 
  }  

  // listen for bytes from the telnet process
  if (telnet.available()) {
    // print the characters to the serial monitor
    Serial.print((char)telnet.read());    
  } 
  
  
   // note the current time in milliseconds:
  long now = millis();
  // check to see if the pushbutton's pressed:
  boolean buttonPushed = buttonRead(connectButton);

  // if the button's just pressed:
  if (buttonPushed) {
    // if the client's connected, disconnect:
    if (telnet.running()) {
      Serial.println("disconnecting");
      telnet.print("x");
    } // if the client's disconnected, try to connect:
    else {
      Serial.println("connecting");
      telnet.runShellCommandAsynchronously("telnet 192.168.0.23 8080");
    }
  }

  // if the client's connected, and the send interval has elapased:
  if (telnet.running() && (now - lastTimeSent > sendInterval)) {      
    // read the joystick and send messages as appropriate:
    int xSensor = analogRead(A1);
    delay(1);
    int ySensor = analogRead(A2);

    // map x and y readings to a 3-point range
    // and subtract 1 to get -1 to 1, with
    // 0 at rest:
    xSensor = map(xSensor, 0, 1023, 0, 3) - 1;
    ySensor = map(ySensor, 0, 1023, 0, 3) -1;

    switch (xSensor) {
    case -1:    //left
      telnet.print("l");
      Serial.print("l");
      digitalWrite(leftLED, HIGH);
      break;
    case 0: // center
      digitalWrite(rightLED, LOW);
      digitalWrite(leftLED, LOW);  

      break;
    case 1:  // right
      telnet.print("r");
      Serial.print("r");
      digitalWrite(rightLED, HIGH);
      break;
    }

    switch (ySensor) {
    case -1:    //up
      telnet.print("u");
      Serial.print("u");
      digitalWrite(upLED, HIGH);
      break;
    case 0: // center
      digitalWrite(upLED, LOW);
      digitalWrite(downLED, LOW);  

      break;
    case 1:  // down
      telnet.print("d");
      digitalWrite(downLED, HIGH);
      break;
    }

    //save this moment as last time you sent a message:
    lastTimeSent = now; 
  }

  // set the connection LED based on the connection state:
  digitalWrite(connectionLED, telnet.running());
}



// this method reads the button to see if it's just changed
// from low to high, and debounces the button in case of
// electrical noise:

boolean buttonRead(int thisButton) {
  boolean result = false;          
  // temporary state of the button:
  int currentState = !digitalRead(thisButton);
  // final state of the button: 
  int buttonState = lastButtonState; 
  // get the current time to time the debounce interval:  
  long lastDebounceTime = millis();  

  while ((millis() - lastDebounceTime) < debounceInterval) {
    // read the state of the switch into a local variable:
    currentState = !digitalRead(thisButton);

    // If the pushbutton changed due to noise:
    if (currentState != buttonState) {
      // reset the debouncing timer
      lastDebounceTime = millis();
    } 

    // whatever the reading is at, it's been there for longer
    // than the debounce delay, so take it as the actual current state:
    buttonState = currentState;
  }
  // if the button's changed and it's high:
  if(buttonState != lastButtonState && buttonState == HIGH) {
    result = true;
  }

  // save the current state for next time:
  lastButtonState = buttonState; 
  return result;
}
