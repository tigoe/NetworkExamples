/*
 
 Telnet on the Yun .
 
 The circuit:
 
 created 17 Sept 2013
 by Tom Igoe
 
 This example code is in the public domain.
 
 */

#include <Process.h>

Process telnet;


void setup() {
  Bridge.begin();	// Initialize the Bridge
  Serial.begin(9600);	// Initialize the Serial

  // Wait until a Serial Monitor is connected.
  while(!Serial);
  // start a telnet connection to the host on port 8080
  telnet.runShellCommandAsynchronously("telnet 192.168.0.10 8080");

}

void loop() {

  // If the process is running, listen for serial input:
  if(telnet.running()) {
    if (Serial.available() > 0) {
      char c = Serial.read();    // read serial in
      telnet.write(c);                // send it to the telnet process
      Serial.write(c);           // echo it back locally
    } 
  }  

  // listen for bytes from the telnet process
  if (telnet.available()) {
    Serial.print((char)telnet.read());    // print the characters to the serial monitor
  } 
}






