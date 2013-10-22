/*
 Bridge RGB LED controller
 Context: Arduino, for Yun
 
 Controls an RGB LED whose R, G and B legs are 
 connected to pins 9, 10, and 11, respectively.
 
 To control it, make a browser request like so:
 r/255/g/0/b/127
 
 This was designed to be used with a REST 
 command string, as shown above.
 
 
 Prepare your Yun's SD card with an empty folder in the SD root named 
 "arduino" and a subfolder of that named "www". 
 This will ensure that the Yún will create a link 
 to the SD to the "/mnt/sd" path.
 
 In this sketch folder is a basic webpage and a copy of jquery, 
 a minimized version of jQuery. When you upload your sketch, 
 these files will be placed in the /arduino/www/BridgeRestToSerial 
 folder on your SD card.
 
 You can then go to http://arduino.local/sd/BridgeRestRGB 
 to see the output of this sketch.
 
 created 19 July 2010
 modified 19 Oct 2013
 by Tom Igoe
 
 */
#include <Bridge.h>
#include <YunServer.h>
#include <YunClient.h>

// constants to hold the output pin numbers:
const int greenPin = 10;
const int anode = 8;
const int bluePin = 11;
const int redPin = 9;

// Listen on default port 5555, the webserver on the Yun
// will forward there all the HTTP requests for us.
YunServer server;

void setup() {
  Serial.begin(9600);

  // initialize the LED pins as outputs:
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);
  // use the anode pin as ground and set it low:
  pinMode(anode, OUTPUT);
  digitalWrite(anode, HIGH);
  // set the color pins high to turn off the LED:
  digitalWrite(redPin, HIGH);
  digitalWrite(greenPin, HIGH);
  digitalWrite(bluePin, HIGH);

  // Bridge startup
  pinMode(13,OUTPUT);
  digitalWrite(13, LOW);
  Bridge.begin();
  digitalWrite(13, HIGH);

  // Listen for incoming connection only from localhost
  // (no one from the external network can connect)
  server.listenOnLocalhost();
  server.begin();
}

void loop() {
  // Get clients coming from server
  YunClient client = server.accept();

  // There is a new client?
  if (client) {
    // Process request
    process(client);

    // Close connection and free resources.
    client.stop();
  }

  delay(50); // Poll every 50ms
}

void process(YunClient client) {
  if (client.available() > 0) {
    int inByte = client.read(); 
    int currentPin = 0;

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
    if (currentPin != 0){
      int brightness = client.parseInt();

      // map the result to a level from 0 to 255
      // note: the reversal of the output values is because
      // you're using a common anode LED, and taking one of 
      // the cathodes HIGH actually turns that channel off:
      brightness = map(brightness, 0, 100, 255, 0);

      // set the brightness for this color:
      analogWrite(currentPin, brightness);    
    }
  }
}




