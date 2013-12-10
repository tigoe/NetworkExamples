/*
 Bridge REST parser example
 Context: Arduino, for Yun
 
 
 
 You can then go to http://arduino.local/arduino/any/string/you/want
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
  int tokenNumber = 0;
  while (client.available() > 0) {
    String inString = client.readStringUntil('/'); 
    client.print("Token number ");
    client.print(tokenNumber);
    client.print(": ");
    Serial.println(inString); 
    client.println(inString);
    if (inString.toInt()) {
      client.print("That's a number, buddy: ");
      client.println(inString.toInt());
    }
    tokenNumber++;
  }
}












