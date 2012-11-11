restToSerial.js

This example allows you to send messages to an Arduino microcontroller
from a web page using a RESTian communications scheme. The server application
is written in node.js using the express.js web framework and node-serialport
for serial communications.


To use this, you should read up on <a href="nodejs.org">node.js</a>

To install it:
* make sure you've installed node.js
* either clone the project in git or download it
* from the command line,change directories to the directory where you downloaded the project

Enter the following:

	npm install 

You should end up with a new directory called node_modules, which will include socket.io, node-serialport, and express.js.

To run it, enter:

	node restToSerial.js portname
	
Where portname is the name of your serial port.
