/*
	restToSerial
	a node.js app to read take requests and send as serial data
	requires:
		* node.js (http://nodejs.org/)
		* express.js (http://expressjs.com/)
		* serialport.js (https://github.com/voodootikigod/node-serialport)
	
	To launch this, type 'node index.js portname' on the commandline, where
	portname is the name of your serial port.
		
	created 5 Nov 2012
	modified 7 Jul 2014
	by Tom Igoe
*/

var serialport = require("serialport"),		// include the serialport library
	SerialPort  = serialport.SerialPort,	   // make a local instance of serial
	express = require('express'),				   // make an instance of express
	app = express();								   // start Express framework


// the third word of the command line command is serial port name:
var portName = process.argv[2];				  
// print out the port you're listening on:
console.log("opening serial port: " + portName);	

// listen for incoming requests on the server:
app.listen(8080);								         
console.log("Listening for new clients on port 8080");

// open the serial port. Uses the command line parameter:
var myPort = new SerialPort(portName, { 
	baudRate: 9600,
	// look for return and newline at the end of each data packet:
	parser: serialport.parsers.readline("\r\n") 
});

/* The rest of the functions are event-driven. 
   They only get called when the server gets incoming GET requests:
*/

// this function responds to a GET request with the index page:
function sendIndexPage(request, response) {
  response.sendfile(__dirname + '/index.html');
}

function sendToSerial(request, response) {
  // the route is the first parameter of the URL request:
  var brightnessCommand = request.params[0];  
  console.log("received "+ brightnessCommand);

  // send it out the serial port:
  myPort.write(brightnessCommand);
  // send an HTTP header to the client:
  response.writeHead(200, {'Content-Type': 'text/html'});
  // send the data and close the connection:
  response.end(brightnessCommand);
}

// respond to web GET requests for the index.html page:
app.get('/', sendIndexPage);
app.get('/index*', sendIndexPage);

// take anything that begins with /output as an LED request:
app.get('/output/*', sendToSerial);
