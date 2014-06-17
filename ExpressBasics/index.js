var express = require('express'),
   app = express(),
   clientName;
	
app.configure(function () {
	/*
	   use a directory called js in your project directory
	   to serve static files. This is so you can serve client-side
	   javaScript files with your index page.
	   
	   If you want to serve CSS, and/or lots of HTML files, it's 
	   useful to set up a static directory for them. express.js 
	   will then serve files from those directories like a regular
	   webserver.
	*/
   app.use('/js', express.static(__dirname + '/js'));
   
  // start listening on port 8080:
   app.listen(8080, function () {
		console.log("Express configured. Listening on port 8080");
   });
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
});
 
// if the request is for /name/Joe, or /name/Jane, then express.js
// will treat the second element of the address string as the name:
app.get('/name/:name', function (request, response) {
	clientName  = request.params.name;
	
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
