/*
	restToSerial
	a node.js app to read take requests and send as serial data
	requires:
		* node.js (http://nodejs.org/)
		* servi.js (https://github.com/antiboredom/servi.js)
		* serialport.js (https://github.com/voodootikigod/node-serialport)
	
	To launch this, type 'node index.js portname' on the commandline, where
	portname is the name of your serial port.
		
	created 5 Nov 2012
	modified 21 Oct 2014
	by Tom Igoe
*/

var serialport = require("serialport"),		// include the serialport library
	SerialPort  = serialport.SerialPort,	   // make a local instance of serial
	servi = require('servi'),		// include the servi library
	app = new servi(false);		// servi instance

// configure the server's behavior:
app.port(8080);						// port number to run the server on
app.serveFiles("public");			// serve all static HTML files from /public


// respond to web GET requests for the index.html page:
app.route('/', sendIndexPage);
app.route('/index*', sendIndexPage);
// take anything that begins with /output as an LED request:
app.route('/output/:color/:brightness', sendToSerial);

// now that everything is configured, start the server:
app.start();	
console.log("Listening for new clients on port 8080");

 
// the third word of the command line command is serial port name:
var portName = process.argv[2];				  
// print out the port you're listening on:
console.log("opening serial port: " + portName);	

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
function sendIndexPage(request) {
  request.serveFile('/index.html');
}

function sendToSerial(request) {
  // get the parameters from the URL:
  var brightnessCommand = request.params.color + request.params.brightness;
  console.log("received "+ brightnessCommand);

  // send it out the serial port:
  myPort.write(brightnessCommand);
  // send the data and close the connection:
  request.respond(brightnessCommand);
}