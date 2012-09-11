/*
  Joystick client
 Language:  Arduino
 
 This program enables an Arduino to control one paddle 
 in a networked Pong game. It uses an Arduino WiFi shield
 
 created 20 Jun 2012
 modified 11 Sept 2012
 by Tom Igoe
 
 */

#include <SPI.h>
#include <Ethernet.h>

// Initialize the Wifi client library
EthernetClient client;

byte mac[] = { 
  0x00, 0xAA, 0xBB, 0xCC, 0xDE, 0x01};

// fill in an available IP address on your network here,
// for manual configuration:
IPAddress ip(10,0,1,20);

IPAddress server(10,0,1,3);

const int connectButton = A3;  // the pushbutton for connecting/disconnecting
const int connectionLED = 3;  // this LED indicates whether you're connected
const int leftLED = 5;        // this LED indicates that you're moving left
const int rightLED = 6;       // this LED indicates that you're moving right
const int upLED = 8;        // this LED indicates that you're moving uo
const int downLED = 9;       // this LED indicates that you're moving down

const int sendInterval = 80;  // minimum time between messages to the server
const int debounceInterval = 15;  // used to smooth out pushbutton readings

int lastButtonState = 0;     // previous state of the pushbutton
long lastTimeSent = 0;       // timestamp of the last server message

void setup()
{

  Serial.begin(9600);  
  //Initialize serial and wait for port to open:
  Serial.begin(9600); 
  while (!Serial) {
    ; // wait for serial port to connect. Needed for Leonardo only
  }


  // start the Ethernet connection:
  if (Ethernet.begin(mac) == 0) {
    Serial.println("Failed to configure Ethernet using DHCP");
    // DHCP failed, so use a fixed IP address:
    Ethernet.begin(mac, ip);
  }

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

void loop()
{
  // note the current time in milliseconds:
  long now = millis();
  // check to see if the pushbutton's pressed:
  boolean buttonPushed = buttonRead(connectButton);

  // if the button's just pressed:
  if (buttonPushed) {
    // if the client's connected, disconnect:
    if (client.connected()) {
      Serial.println("disconnecting");
      client.print("x");
      client.stop();
    } // if the client's disconnected, try to connect:
    else {
      Serial.println("connecting");
      client.connect(server, 8080);
    }
  }

  // if the client's connected, and the send interval has elapased:
  if (client.connected() && (now - lastTimeSent > sendInterval)) {      
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
      client.print("l");
      Serial.print("l");
      digitalWrite(leftLED, HIGH);
      break;
    case 0: // center
      digitalWrite(rightLED, LOW);
      digitalWrite(leftLED, LOW);  

      break;
    case 1:  // right
      client.print("r");
      Serial.print("r");
      digitalWrite(rightLED, HIGH);
      break;
    }

    switch (ySensor) {
    case 1:    //up
      client.print("u");
      Serial.print("u");
      digitalWrite(upLED, HIGH);
      break;
    case 0: // center
      digitalWrite(upLED, LOW);
      digitalWrite(downLED, LOW);  

      break;
    case -1:  // down
      client.print("d");
      digitalWrite(downLED, HIGH);
      break;
    }

    //save this moment as last time you sent a message:
    lastTimeSent = now; 
  }

  // set the connection LED based on the connection state:
  digitalWrite(connectionLED, client.connected());


  // if there's incoming data from the client, print it serially:
  if (client.available()) {
    char c = client.read();
    Serial.write(c);
  }
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



