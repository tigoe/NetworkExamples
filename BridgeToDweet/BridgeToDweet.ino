/*

 Bridge to dweet.io
 
 Uses Arduino Bridge library to store sensor data on dweet.io
 
 Change "your-dweet-name" to something unique to you. Make sure your Yun
 is on the internet. no other changes needed.

 To see the results, go to http://dweet.io/follow/your-dweet-name
 (change the name to your name, of course)

 created 15 Oct 2014
 by Tom Igoe

*/
#include <Bridge.h>
#include <Process.h>

String dweetName = "your-dweet-name";  // change this to something unique to you
String command;

void setup() {
    Serial.begin(9600);
  while(!Serial);    // wait for the serial monitor to be opened
  Serial.println("Starting...");
  Bridge.begin();
  Serial.println("Bridge started...");
  command.reserve(200);      // reserve space for the command string
}

void loop() {
  // start a new process on the linux side of the Yun:
  Process curl;
  command = "curl -k \"https://dweet.io/dweet/for/";
  command += dweetName;
  command += "?sensor=";
  command += analogRead(A0);
  command += "\"";
  
  // print the command to the serial monitor (for debugging only):
  Serial.println();
  Serial.println(command);
  
  curl.runShellCommand(command);  // run the command
  while (curl.running());         // wait for the process to finish
  
  // read the response and print it to the serial monitor:
  while (curl.available() > 0) {
    String response = curl.readString();
    Serial.println(response);
  }
  
  // wait 10 seconds before sending again:
  delay(10000);
}


