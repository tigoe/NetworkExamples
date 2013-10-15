/*
	SerialTest.js
	
	Tests the functtionality of the serial port library


*/


var serialport = require("serialport"),	// include the serialport library
	SerialPort  = serialport.SerialPort,	// make a local instance of it
	portName = process.argv[2];				// get the serial port name from the command line

// open the serial port. Change the name to the name of your port, just like in Processing and Arduino:
var myPort = new SerialPort(portName, { 
	// look for return and newline at the end of each data packet:
	parser: serialport.parsers.readline("\r\n") 
});
  
  
// if there's any serial data to read, read it:  
myPort.on('data', function (data) {
	// for debugging, you should see this in Terminal:
	console.log(data);
});
