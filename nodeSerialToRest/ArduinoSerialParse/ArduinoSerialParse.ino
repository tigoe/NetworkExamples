void setup() {
   // initialize serial communication:
  Serial.begin(9600);   
  // set the serial receive timeout to 10ms:
  Serial.setTimeout(10); 
}

void loop() {
  // when there's serial data:
  while (Serial.available()) {
    // parse incoming data for a number:
    int channel = Serial.parseInt();
    // if the number's between 0 and 6:
    if (channel >= 0 && channel < 6 ) {
      // read the corresponding analog input:
      int sensor = analogRead(channel);
      // print the result back to the server:
      Serial.println(sensor);
    }
  }
}
