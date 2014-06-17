/*
	nodeSerialIn.js
	
	Tests the functtionality of the serial port library
		To be used in conjunction with the Arduino sketch called AnalogReadSerial.ino,
		which can be found under File -> Examples ->01.Basics -> AnalogReadSerial in 
		the Arduino IDE

	This script expects a steady stream of input
	from the serial port separated by carriage return and newline characters (\r\n).
	
	To call this from the command line:
	
	node serialTest.js portname
	 
	where portname is the path to the serial port.
	
	created 21 Aug 2012
	modified 17 Jun 2014
	by Tom Igoe

*/


var serialport = require("serialport"),	// include the serialport library
	SerialPort  = serialport.SerialPort,	// make a local instance of it
	portName = process.argv[2],				// get the serial port name from the command line
	ledState = false;
	
	var brightness = 0;

// open the serial port. The portname comes from the command line:
var myPort = new SerialPort(portName, { 
	baudRate: 9600,
	// look for return and newline at the end of each data packet:
	parser: serialport.parsers.readline("\r\n")
});
 
// called when the serial port opens:
myPort.on('open', function() {
	console.log('port open');
	console.log('baud rate: ' + myPort.options.baudRate);
	
	// called when there's new incoming serial data:  
	myPort.on('data', function (data) {
		// for debugging, you should see this in Terminal:
		console.log(data);
	});
});

// called when the serial port closes:
myPort.on('close', function() {
	console.log('port closed');
});

// called when there's an error with the serial port:
myPort.on('error', function(error) {
	console.log('there was an error with the serial port: ' + error);
	myPort.close();
});







