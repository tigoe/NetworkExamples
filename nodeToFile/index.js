/*
	nodeToFile
	a node.js app to read take requests and send as serial data
	
	Shows how to write to a file on the server from node.
	This example is very basic, and doesn't include checks for if the file exists, etc.
	It overwrites the file every time, so use with caution.
		
	created 10 Dec 2013 
	modified 20 Jan 2014
	by Tom Igoe
	
*/
var express = require('express'),		// using the express framework
    fs = require('fs')						// and the filesystem library	
    url = require('url');					// and the URL library
var app = express();							// initalize express
var currentData = {};						// set up a variable to hold the data

app.use(express.urlencoded()); 			// use express' urlencoded middleware

app.listen(8080);								// listen for new requests


// respond to web GET requests with the index.html page:
app.get('/', function (request, response) {
  response.sendfile(__dirname + '/index.html');
});

// respond to GET request for data
app.get('/data', function (request, response) {
	// the file to the data file on the server:
  var filePath = __dirname + '/data.txt';
  
  /* read the file  asynchronously.
     the second parameter of readFile is 
     the callback function that's called when
     readFile completes:
   */
  fs.readFile(filePath, function (error, data) {
  		// if something goes wrong, throw an error:
  		if (error) throw error;
  		
  		// if you have a successful file read, print it
  		// to the client:
  		response.writeHead(200, {'Content-Type': 'text/html'});
    	response.write("Here's what's in the data.txt file: <br>");
  		response.write(data.toString());
    	response.write("<br><a href=\"/\">Return to form</a>");
	 	response.end();
  	});
});

// respond to POST request to update data:
app.post('/post', function(request, response) {	
	// because you're using the urlencoded middleware,
	// you can ask for pieces of the request like this:
	currentData.name = request.body.name;
	currentData.duration = request.body.duration;   
	
	// get the path to the data file: 
   var filePath = __dirname + '/data.txt';
   // convert the data, currently a JSON object, to a string:
   var dataString = JSON.stringify(currentData);
   
   /* 
   	write to the file asynchronously. THe third parameter of 
   	writeFile is the callback function that's called when
   	you've had a successful write. 
   */
   fs.writeFile(filePath, dataString, function() {
    	response.writeHead(200, {'Content-Type': 'text/html'});
    	response.write("You wrote the following to the data file: <br>");
    	response.write(dataString);
    	response.write("<br><a href=\"/\">Return to form</a>");
    	response.end();
    });
});