nodeToProcessing.js

A  serial-to-node-to-Processing example using node.js, node-serialport.

To use this, you should read up on <a href="nodejs.org">node.js</a>

To install it:
* make sure you've installed node.js
* either clone the project in git or download it
* from the command line,change directories to the directory where you downloaded the project

Enter the following:

	npm install 

You should end up with a new directory called node_modules, which will include socket.io, node-serialport, and express.js.

Install ADXL326.ino onto an Arduino Uno or Leonardo or Mega that has an ADXL326 acclerometer breakout board from Adafruit attached.

To run the server, enter:

	node nodeToProcessing.js

Then open jsonProcessing.pde in Processing 2.0 or later, and run it. You should get a nice scatter graph of the X and Y coordinates from the acceleromter.