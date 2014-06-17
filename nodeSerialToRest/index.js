/*
	serialToRest
	a node.js app to read take requests and reply with serial data
	requires:
		* node.js (http://nodejs.org/)
		* express.js (http://expressjs.com/)
		* socket.io (http://socket.io/#how-to-use)
		* serialport.js (https://github.com/voodootikigod/node-serialport)
		
				
	created 5 Nov 2012
	modified 17 Jun 2014
	by Tom Igoe
	
*/

var serialport = require("serialport"),		// include the serialport library
	SerialPort  = serialport.SerialPort,	   // make a local instance of serial
	express = require('express'),				   // make an instance of express
	open = require('open'),                   // used to open the browser
	url = 'http://localhost:8080';            // URL to open in the browser
	
var app = express(),								   // start Express framework
   server = require('http').createServer(app);		// start an HTTP server

// configure server to serve static files from /js so you can use zepto:
app.use('/js', express.static(__dirname + '/js'));
 
// third word of the command line is serial port name:
var portName = process.argv[2];				  
// print out the port you're listening on:
console.log("opening serial port: " + portName);	

// listen for incoming requests on the server:
server.listen(8080);								         
console.log("Listening for new clients on port 8080");
// open the app in a browser:
open(url);                   

// open the serial port. Uses the command line parameter:
var myPort = new SerialPort(portName, { 
	// look for return and newline at the end of each data packet:
	parser: serialport.parsers.readline("\r\n") 
});

/* The rest of the functions are event-driven. 
   They only get called when the server gets incoming GET requests:
*/

// respond to web GET requests with the index.html page:
app.get('/', getIndexPage);
  
// take anything that begins with /output:
app.get('/analog/*', getAnalog);

// get the index page:
function getIndexPage (request, response) {
  response.sendfile(__dirname + '/index.html');
}

// get an analog reading from the serial port:
function getAnalog(request, response) {
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
