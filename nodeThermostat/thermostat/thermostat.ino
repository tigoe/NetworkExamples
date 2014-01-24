#include <Encoder.h>

float previousTemp = 0.0;  // the last temperature reading
float setPoint = 10.0;     // the current setPoint
float prevSetPoint = 10.0; // the last setPoint reading
int prevEncoderPos = -1;   // the last encoder reading

Encoder encoder(2, 3);     // initialize encoder on pins 2 and 3

void setup() {
  pinMode (A1, OUTPUT);
  pinMode(A3, OUTPUT);
  digitalWrite(A1, HIGH);
  digitalWrite(A3, LOW);
  // open serial communication:
  Serial.begin(9600);

}

void loop() {
  // read the encoder:
  int knob = encoder.read();

  // if it's changed, take action:
  if (knob != prevEncoderPos) {
    // get the difference, and save the current value
    // for next time:
    int difference =  knob - prevEncoderPos;
    prevEncoderPos = knob;

    // calculate a new setPoint from the difference:
    setPoint += (difference / 10.0);
    // if the setPoint's at the edge of its range,
    // reset the encoder and constrain the setPoint:
    if (setPoint <= 10 || setPoint >= 30) {
      encoder.write(0);
      prevEncoderPos = 0;
      setPoint = constrain(setPoint, 10.0, 30.0);
    }
  }


  // read the value from the sensor:
  int tempSensor = analogRead(A2);
  // convert the reading to millivolts:
  float voltage = tempSensor *  (5000 / 1024);
  // convert the millivolts to temperature celsius:
  float temperature = (voltage - 500) / 10;
  // If the temperature of the setPoint
  // has changed enough, send the values out:
  if ( (abs(temperature - previousTemp) > 0.5) ||
       (abs(setPoint - prevSetPoint) > 0.5)) {
    Serial.print(setPoint);
    Serial.print(",");
    Serial.println(temperature);
    // save current values for next time:
    previousTemp = temperature;
    prevSetPoint = setPoint;
  }

  // if data comes in, it'll be the server
  // sending you an updated setPoint. Parse it:
  while (Serial.available() > 0) {
    float incoming = Serial.parseFloat();
    if (incoming != 0) {
      setPoint = incoming;
    }
  }
}
