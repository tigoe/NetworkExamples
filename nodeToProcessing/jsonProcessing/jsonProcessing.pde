/*
  jsonProcessing
 
 Makes an HTTP request using loadStrings to get sensor data
 from a node.js server.  Expects the following JSON format:
 {x:345, y:432, z:234}\n
 
 Uses Jer Thorp's JSON library for Processing, available here:
 http://www.blprnt.com/processing/json.zip
 Details:
 http://blog.blprnt.com/blog/blprnt/processing-json-the-new-york-times
 Java JSON docs:
 http://www.json.org/java/
 
 created 16 Oct 2012
 by Tom Igoe  
 */

import org.json.*;  // import JSON library

String URL = "http://localhost:8080/sensors";

void setup() {
  // set up graphics:
  size(400, 400);
  background(#002379);
  noStroke();
}

void draw() {
  // get coordinates from server:
  int[] coordinates = getData(URL);

  // map to the size of the screen:
  float x = map(coordinates[0], 250, 450, 0, width);
  float y = map(coordinates[1], 250, 450, 0, height);

  // make a fill color and draw a point
  fill(255);
  ellipse(x, y, 1, 1);
}

int[] getData(String request) {
  int results[] = new int[3];    // array to return results
  // make a HTTP request, and join the resulting array back into a string:
  String data = join(loadStrings(request), "");
  
  // try to parse the resulting JSON into an array:
  try {
    JSONObject sensorData = new JSONObject(data); 
    results[0] = sensorData.getInt("x");
    results[1] = sensorData.getInt("y");
    results[2] = sensorData.getInt("z");
  }
  catch (JSONException e) {
    println ("There was an error parsing the JSONObject.");
  }
  // return the array:
  return results;
}

