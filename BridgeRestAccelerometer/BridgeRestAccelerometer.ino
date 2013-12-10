/*
 Bridge REST accelerometer example
 Context: Arduino, for Yun
 
 
 
 You can then go to http://arduino.local/arduino/accelerometer
 to see the output of this sketch.
 
 created 10 Dec 2013
 by Tom Igoe
 
 */
#include <Bridge.h>
#include <YunServer.h>
#include <YunClient.h>


// Listen on default port 5555, the webserver on the Yun
// will forward there all the HTTP requests for us.
YunServer server;

int accelerometer[3];

void setup() {
  Serial.begin(9600);

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
    String inString = client.readStringUntil('/'); 
    Serial.println(inString); 
    inString.trim(); 
    if (inString == "accelerometer") {
      accelerometerRead();
      char token = client.read();
      String content = "{";
      switch(token) {
      case 'x':
        content += "\"x\":";
        content += accelerometer[0];

        content += "}";
        break;
      case 'y':
        content += "\"y\":";
        content += accelerometer[1];
        content += "}";
        break;
      case 'z':
        content += "\"z\":";
        content += accelerometer[2];
        content += "}";
        break; 
      default:
        content = makeJson();
      }

      client.println(content);
    }
  }
}

void accelerometerRead() {
  // read the accelerometer values into the array:
  accelerometer[0] = analogRead(A0);
  delay(1);
  accelerometer[1] = analogRead(A1);
  delay(1);
  accelerometer[2] = analogRead(A2);
}


String makeJson() {
  String result = "{\"x\":";
  result += accelerometer[0];
  result += ",\"y\":";
  result += accelerometer[1];
  result += ",\"z\":";
  result += accelerometer[2];
  result += "}";
  return result;
}











