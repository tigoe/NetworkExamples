
#include <Process.h>

void setup() {
  // Initialize Bridge
  Bridge.begin();

  // Initialize Serial
  Serial.begin(9600);

  // Wait until a Serial Monitor is connected.
  while (!Serial);
}

void loop() {
  Process p;
  p.begin("curl");
  p.addParameter("http://tigoe.net/mtt2/age_checker.php");
  p.addParameter("-d");
  p.addParameter("name=Tom&age=23");
  p.addParameter("-i");
  p.run();

  while (p.available()>0) {
    char c = p.read();
    Serial.print(c);
  }

  while(true);

}


