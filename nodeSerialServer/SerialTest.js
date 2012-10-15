/*
	SerialTest.js
	
	Tests the functtionality of the serial port library


*/


var serialport = require("serialport"),	// include the serialport library
	SerialPort  = serialport.SerialPort;

// open the serial port. Change the name to the name of your port, just like in Processing and Arduino:
var myPort = new SerialPort("/dev/cu.usbmodem621", { 
	// look for return and newline at the end of each data packet:
	parser: serialport.parsers.readline("\r\n") 
});
  
  
// if there's a socket client, listen for new serial data:  
myPort.on('data', function (data) {
	// for debugging, you should see this in Terminal:
	console.log(data);
});
