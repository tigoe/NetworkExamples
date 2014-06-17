/*
	nodeSerialOut.js
	
	Tests the functtionality of the serial port library.
	To be used in conjunction with the Arduino sketch called AsciiSerialRead.ino
	
	This script sends a number out the serial port
	every second.
	
	To call this from the command line:

	node serialTest.js portname
	 
	where portname is the path to the serial port.
	
	created 17 June 2014
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
	
	function sendData() {
	// make sure the port is open before you write to it:
		myPort.write("" +brightness);
		console.log("Sending " + brightness + " out the serial port");
		if (brightness < 255) {
			brightness+= 10;
		} else {
			brightness = 0;
		}	
	}
	// set an intercal to toggle LEDState every second:
	setInterval(sendData, 1000);

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












