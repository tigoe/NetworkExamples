/*
  Ball Drop Client
 Language:  Processing
 
 Starts a network client that connects to a server on port 8080,
 sends any keystrokes pressed. 
 
 For use with the Ball Drop Server game.
 
 Created sometime in 2007
 modified 10 Sept 2012
 by Tom Igoe
 
 */


import processing.net.*;

Client myClient;                   // instance of the net Client
String data;                       // string to hold incoming data
String ipAddress = "127.0.0.1";    // address of the server goes here

void setup() {
  // establish the background and foreground:
  size(400, 300);      
  background(50);
  fill(200);
  // Connect to server on port 8080
  myClient = new Client(this, ipAddress, 8080);
  background(#000045);
    fill(#eeeeff);
}

void draw() {
  // If there's incoming data from the client:
  if (myClient.available() > 0) { 
    // get the data:
    data = myClient.readString(); 
    background(#000045);
    fill(#eeeeff);
    text(data, 10, 10);
  }
}

void keyReleased() {
  // send out anything that's typed:
  myClient.write(key);
}
