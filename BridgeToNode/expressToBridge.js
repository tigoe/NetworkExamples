var readline = require('readline'),
	express = require('express'),
   app = express(),
   clientName;

console.log("Hello Arduino");

 app.listen(8080, function () {
		console.log("Express configured. Listening on port 8080");
   });
   
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});


rl.on('line', function (cmd) {
  console.log('You just typed: '+cmd);
});




// respond to web GET requests with the index.html page.
// this is how you serve a file that's not in a static directory:
app.get('/', function (request, response) {
   response.sendfile('index.html');
      console.log(request.ip);
});

// function for serving index.html, or index. anything:
app.get('/index*', function (request, response) {
   response.sendfile('index.html');
});

// function for serving index.html, or index. anything:
app.get('/me', function (request, response) {
//send a response to the client:
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.write("Your IP address: " + request.ip);
	response.end("\n\n");
	console.log("New Web Client: " + request.ip);
});
 
// if the request is for /name/Joe, or /name/Jane, then express.js
// will treat the second element of the address string as the name:
app.get('/name/:name', function (request, response) {
	clientName  = request.params.name;
	
	console.log("Guess who's here? " + clientName);
	//send a response to the client:
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.write("You sent me the name: " + clientName);
	response.end();
});

// if the request is for /name without a value, return the current
// value of clientName. If there is no value for clientName,
// return a message to that effect:
app.get('/name', function (request, response) {
	var content;
	
	if (!clientName) {
		content = "You didn't give me a name yet.";
	} else {
		content = clientName;
	}

	//send a response to the client:
	response.writeHead(200, {'Content-Type': 'text/html'});
	response.write(content);
	response.end();
});
