/*
	Lists serial ports. Copied from https://github.com/voodootikigod/node-serialport readme
*/

  var serialport = require("serialport");
  var SerialPort = serialport.SerialPort; // localize object constructor

// list serial ports:
serialport.list(function (err, ports) {
    ports.forEach(function(port) {
      console.log(port.comName);
      console.log(port.pnpId);
      console.log(port.manufacturer);
    });
  });

