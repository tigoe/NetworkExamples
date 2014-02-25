/*
	SerialTest.js
	
	Tests the functtionality of the serial port library
	
	This script expects a steady stream of input
	from the serial port separated by carriage return and newline characters (\r\n).
	Every three seconds it will send a character out the serial port.
	
	To call this from the command line:
	
	node serialTest.js portname
	 
	where portname is the path to the serial port.
	
	created 21 Aug 2012
	modified 11 Feb 2014
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
	// add an option in the serial port object 
	// so that you can keep track of whether or not the serial port is open:
	isOpen: false,
	// look for return and newline at the end of each data packet:
	parser: serialport.parsers.readline("\r\n")
});
 
// called when the serial port opens:
myPort.on('open', function() {
	console.log('port open');
	console.log('baud rate: ' + myPort.options.baudRate);
	// set options.open so you can track the port statue:
	myPort.options.isOpen = true;
});

// called when the serial port closes:
myPort.on('close', function() {
	console.log('port closed');
	// set options.open so you can track the port statue:
	myPort.options.isOpen = false;
});

// called when there's an error with the serial port:
myPort.on('error', function(error) {
	console.log('there was an error with the serial port: ' + error);
	myPort.close();
});

// called when there's new incoming serial data:  
myPort.on('data', function (data) {
	// for debugging, you should see this in Terminal:
	console.log(data);
});

function sendData() {
	// make sure the port is open before you write to it:
	if (myPort.options.isOpen) {
		myPort.write('r' + brightness);
		if (brightness < 100) {
			brightness+= 10;
		} else {
			brightness = 0;
		}
		
		
	}
}

// set an intercal to toggle LEDState every 3 seconds:
setInterval(sendData, 1000);









