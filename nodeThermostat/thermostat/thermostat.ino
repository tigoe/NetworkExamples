float previousTemp = 0.0;
float prevSetPoint = 0.0;

void setup() {
  pinMode (A1, OUTPUT);
  pinMode(A3, OUTPUT);
  digitalWrite(A1, HIGH);
  digitalWrite(A3, LOW);
  Serial.begin(9600);

}

void loop() {
  int knob = analogRead(A0);
  float setPoint = map(knob, 0, 1023, 10, 30);
  delay(1);
  // read the value from the sensor:
  int tempSensor = analogRead(A2);
  // convert the reading to millivolts:
  float voltage = tempSensor *  (5000 / 1024);
  // convert the millivolts to temperature celsius:
  float temperature = (voltage - 500) / 10;
  // print the temperature:
  if ( (abs(temperature - previousTemp) > 0.5) || (abs(setPoint - prevSetPoint) > 0.5)) {
    Serial.print(prevSetPoint);
    Serial.print(",");
    Serial.print(previousTemp);
        Serial.print(",");
    Serial.print(setPoint);
    Serial.print(",");
    Serial.println(temperature);
 
  previousTemp = temperature;
  prevSetPoint = setPoint;
  }
 
}
