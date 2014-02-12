void setup() {
  Serial.begin(9600);
  Serial.setTimeout(10);
}

void loop() {
  while (Serial.available()) {
    int channel = Serial.parseInt();
    if (channel > 0 && channel < 6 ) {
      int sensor = analogRead(channel);
      Serial.println(sensor);
    }
  }
}
