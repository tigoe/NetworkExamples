/*
	serialToRest
	a node.js app to read take requests and reply with serial data
	requires:
		* node.js (http://nodejs.org/)
		* express.js (http://expressjs.com/)
		* serialport.js (https://github.com/voodootikigod/node-serialport)
		
				
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

// get the index page:
function sendIndexPage (request, response) {
  response.sendfile(__dirname + '/index2.html');
}

// get an analog reading from the serial port:
function getAnalogReading(request, response) {
  // the first parameter after /analog/ is the channel number:
  var channel = request.params[0];  
  console.log("getting channel: "+ channel + "...");

  // send it out the serial port and wait for a response:
  myPort.write(channel, function() {
		// send an HTTP header to the client:
		response.writeHead(200, {'Content-Type': 'text/html'}); 

		// when you get a response from the serial port, write it out to the client: 
		myPort.on('data', function(data) {
  	  		// send the data and close the connection:
  	  		response.write(data);
  	  		response.end();
  	  	});    
  }); 
}

// respond to web GET requests with the index.html page:
app.get('/', sendIndexPage);
  
// take anything that begins with /output:
app.get('/analog/*', getAnalogReading);

