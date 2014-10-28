/*
	serialServer.js
	a node.js app to read serial strings and send them to webSocket clients
	requires:
		* node.js (http://nodejs.org/)
		* express.js (http://expressjs.com/)
		* serialport.js (https://github.com/voodootikigod/node-serialport)
		* ws.js (https://www.npmjs.org/package/ws)
						
	created 21 Aug 2012
	modified 27 Oct 2014
	by Tom Igoe
	
	Patches and improvements suggested by Steve Klise, Lia Martinez, and Will Jennings

*/

var serialport = require("serialport"),		// include the serialport library
	SerialPort  = serialport.SerialPort,	   // make a local instance of serial
	express = require('express'),				   // make an instance of express
	url = 'http://localhost:8080';            // URL to open in the browser
 
var app = express(),								   // start Express framework
   server = require('http').createServer(app),		// start an HTTP server
 	WebSocketServer = require('ws').Server,
   socketServer = new WebSocketServer({server: server});

// third word of the command line is serial port name:
var portName = process.argv[2];				  
// print out the port you're listening on:
console.log("opening serial port: " + portName);	

// listen for incoming requests on the server:
server.listen(8080);								         
console.log("Listening for new clients on port 8080");

// open the serial port:
var myPort = new SerialPort(portName, { 
	// look for return and newline at the end of each data packet:
	parser: serialport.parsers.readline("\r\n") 
});
  
// respond to web GET requests with the index.html page:
app.get('/', function (request, response) {
  response.sendFile(__dirname + '/index.html');
});


// listen for new socket.io connections:
socketServer.on('connection', function (socket) {
	
	// if there's a socket client, listen for new serial data:  
   myPort.on('data', function (data) {
      // for debugging, you should see this in Terminal:
      console.log(data);
      // send a serial event to the web client with the data:
      socket.send(data);
	});
});
