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
	by Tom Igoe
	
*/


var serialport = require("serialport"),				// include the serialport library
	SerialPort  = serialport.SerialPort,			// make a local instance of serial
	app = require('express')(),						// start Express framework
  	server = require('http').createServer(app),		// start an HTTP server
  	io = require('socket.io').listen(server);		// filter the server using socket.io

var portName = process.argv[2];						// third word of the command line should be serial port name
console.log("opening serial port: " + portName);	// print out the port you're listening on

server.listen(8080);								// listen for incoming requests on the server

console.log("Listening for new clients on port 8080");

// open the serial port. Change the name to the name of your port, just like in Processing and Arduino:
var myPort = new SerialPort(portName, { 
	// look for return and newline at the end of each data packet:
	parser: serialport.parsers.readline("\r\n") 
});
  
// respond to web GET requests with the index.html page:
app.get('/', function (request, response) {
  response.sendfile(__dirname + '/index.html');
});


app.get('/output*', function (request, response) {
  var params = request.params[0]; //.split("/");
  //var stringToSend = params.join("");
  myPort.write(params);
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.end("you sent " + params);
});
