/*
	serialServer.js
	a node.js app to read serial strings and send them to webSocket clients
	requires:
		* node.js (http://nodejs.org/)
		* express.js (http://expressjs.com/)
		* socket.io (http://socket.io/#how-to-use)
		* serialport.js (https://github.com/voodootikigod/node-serialport)
		
	based on the core examples for socket.io and serialport.js
		
	created 21 Aug 2012
	modified 19 Jan 2014
	by Tom Igoe
	
	Patches and improvements suggested by Steve Klise, Lia Martinez, and Will Jennings

*/


	


var serialport = require("serialport"),		// include the serialport library
	SerialPort  = serialport.SerialPort,	   // make a local instance of serial
	express = require('express'),				   // make an instance of express
	open = require('open'),                   // used to open the browser
	url = 'http://localhost:8080';            // URL to open in the browser
 
var app = express(),								   // start Express framework
   server = require('http').createServer(app);		// start an HTTP server
  	io = require('socket.io').listen(server);		// listen for websocket requests

// third word of the command line is serial port name:
var portName = process.argv[2];				  
// print out the port you're listening on:
console.log("opening serial port: " + portName);	

// listen for incoming requests on the server:
server.listen(8080);								         
console.log("Listening for new clients on port 8080");
// open the app in a browser:
open(url);                   

// open the serial port:
var myPort = new SerialPort(portName, { 
	// look for return and newline at the end of each data packet:
	parser: serialport.parsers.readline("\r\n") 
});
  
// respond to web GET requests with the index.html page:
app.get('/', function (request, response) {
  response.sendfile(__dirname + '/index.html');
});

// listen for new socket.io connections:
io.sockets.on('connection', function (socket) {
   // if there's a socket client, listen for new serial data:  
   myPort.on('data', function (data) {
      // for debugging, you should see this in Terminal:
      console.log(data);
      // send a serial event to the web client with the data:
      socket.emit('serialEvent', data);
	});
});
