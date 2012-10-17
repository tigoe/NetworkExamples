/*
	nodeToProcessing.js
	a node.js app to respond to HTTP requests from Processing
	requires:
		* node.js (http://nodejs.org/)
		* express.js (http://expressjs.com/)
		* serialport.js (https://github.com/voodootikigod/node-serialport)		
				
	See jsonProcessing.pde in this project for a Processing sketch that
	wil act as a client to this app.
	
	See also ADXL326.ino for an Arduino sketch that will send a
	JSON-formatted string to this app via serial communication.
	
	created  16 Oct 2012
	by Tom Igoe
	
*/

var serialport = require("serialport"),		// include the serialport library
	SerialPort  = serialport.SerialPort,	// make a local instance of serial
	app = require('express')();				// start Express framework

var sensorData = {};						// object to hold what goes out to the client

app.listen(8080);							// listen for incoming requests on the server

console.log("Listening for new clients on port 8080");

// open the serial port. Change the name to the name of your port, just like in Processing and Arduino:
var myPort = new SerialPort("/dev/cu.usbmodem621", { 
	// look for return and newline at the end of each data packet:
	parser: serialport.parsers.readline("\r\n") 
});

myPort.on('data', function (data) {
	var values = [];
	// get the serial string and put it in the sensorData object:
	sensorData = data;
	});
		  
// respond to web GET requests with the index.html page:
app.get('/', function (request, response) {
  response.sendfile(__dirname + '/index.html');
});	
	  	  
// respond to web GET requests for /sensors with the sensor data:
app.get('/sensors', function (request, response) {
  response.send(sensorData);
});



