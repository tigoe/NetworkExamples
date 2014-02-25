/*
  Temperature web interface

 This example shows how to use the Bridge Library's put() command
 to send data from the Arduino processor to the linux processor.
 That data can later be requested from the linux processor using the
 REST API.
 
 The enclosed wed page will get the data via the REST API.
 You can also call it yourself from the URL: 
 http://arduino.local/data/get/temperature
 
 The circuit:
 * TMP36 temperature sensor on analog pin A1
 * SD card attached to SD card slot of the Arduino Yún

 Prepare your SD card with an empty folder in the SD root
 named "arduino" and a subfolder of that named "www".
 This will ensure that the Yún will create a link
 to the SD to the "/mnt/sd" path.

 In this sketch folder is a basic webpage When you upload your sketch, 
 these files will be placed in the /arduino/www/RestPutExample 
 folder on your SD card.

 You can then go to http://arduino.local/sd/RestPutExample
 to see the output of this sketch.

 You can remove the SD card while the Linux and the
 sketch are running but be careful not to remove it while
 the system is writing to it.

 created  24 Feb 2014
 by Tom Igoe

 This example code is in the public domain.

 */
 
 #include <Bridge.h>

void setup() {
  // initiate Bridge connection to linux processor:
  Bridge.begin();
  Serial.begin(9600);

  // using A0 and A2 as vcc and gnd for the TMP36 sensor:
  pinMode(A0, OUTPUT);
  pinMode(A2, OUTPUT);
  digitalWrite(A0, HIGH);
  digitalWrite(A2, LOW);
}

void loop() {
  int sensorValue = analogRead(A1);
  // convert the reading to millivolts:
  float voltage = sensorValue *  (5000 / 1024);
  // convert the millivolts to temperature celsius:
  float temperature = (voltage - 500) / 10;
  String output = String(temperature);
  Serial.println(output);
  Serial.println("uploading data for REST API");
  Bridge.put("temperature", output);
  delay(10000);
}
