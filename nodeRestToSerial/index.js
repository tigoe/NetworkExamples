/*
	restToSerial.js
	a node.js app to read take requests and send as serial data
	requires:
		* node.js (http://nodejs.org/)
		* express.js (http://expressjs.com/)
		* socket.io (http://socket.io/#how-to-use)
		* serialport.js (https://github.com/voodootikigod/node-serialport)
		
	based on the core examples for socket.io and serialport.js
		
	created 5 Nov 2012
	modified 19 Oct 2013
	by Tom Igoe
	
*/


var serialport = require("serialport"),				// include the serialport library
	SerialPort  = serialport.SerialPort,			   // make a local instance of serial
	express = require('express'),					      // make an instance of express
	app = express(),								         // start Express framework
  	server = require('http').createServer(app);		// start an HTTP server
 
var portName = process.argv[2];						   // third word of the command line is serial port name
console.log("opening serial port: " + portName);	// print out the port you're listening on

server.listen(8080);								// listen for incoming requests on the server

console.log("Listening for new clients on port 8080");

// configure server to serve static files from /js and /css:
  app.use('/js', express.static(__dirname + '/js'));
  app.use('/css', express.static(__dirname + '/css'));

// respond to web GET requests with the index.html page:
app.get('/', function (request, response) {
  response.sendfile(__dirname + '/index.html');
});

// open the serial port. Uses the command line parameter:
var myPort = new SerialPort(portName, { 
	// look for return and newline at the end of each data packet:
	parser: serialport.parsers.readline("\r\n") 
});
  

// take anything that begins with /output:
app.get('/output*', function (request, response) {
  // the route is the first parameter of the URL request:
  var params = request.params[0].split("/");
  var brightnessCommand = params.join(""); 
  console.log("received "+brightnessCommand);

  // send it out the serial port:
  myPort.write(brightnessCommand);
  // send an HTTP header to the client:
  response.writeHead(200, {'Content-Type': 'text/html'});
  // send the data and close the connection:
  response.end(brightnessCommand);
});
