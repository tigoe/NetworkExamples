SerialServer.js

A simple serial-to-web example using node.js, node-serialport, and socket.io

To use this, you should read up on <a href="nodejs.org">node.js</a>

To install it:
* make sure you've installed node.js
* either clone the project in git or download it
* from the command line,change directories to the directory where you downloaded the project

Enter the following:

	npm install 

You should end up with a new directory called node_modules, which will include socket.io, node-serialport, and express.js.

To run it, enter:

	node SerialServer.js

You'll also find a SerialTest.js, ServerTest.js, and ListPorts.js, for testing purposes:

* SerialTest.js - opens a serial port and listens for data
* ServerTest.js - starts a server and says hello to clients
* ListPorts.js - lists available serial ports. Note that on OSX, port names do not list correctly, due to an issue in node-serialport.