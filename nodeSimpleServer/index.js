/*
	Simple Node Server showing request info
	
	Shows how to extract some of the info in the HTTP request
	received by the server
	
	Based on node.js basic documentation
	
	created 2 Feb 2014
	by Tom Igoe

*/

var http = require("http"),							// require HTTP library
	server = http.createServer(respondToClient);	// create a server with a callback

var ip = require("ip");
console.log( ip.address() );

server.listen(8080);				// start the server listening

// let the user know you started:
console.log('Server is listening on port 8080');


// this is the callback function that's called
// whenever a client makes a request:
function respondToClient(request, response) {  
	console.log("request from: ");
	console.log(request.connection.remoteAddress);
	
	console.log("headers:");
	console.log(request.headers);
	
	console.log("URL:");
	console.log(request.url);
	
	// if you got a POST request, here's the body
	request.on('data', function(body) {
		console.log("Body of request:");
		console.log(body.toString());
	});
	
	// write back to the client:
	response.writeHead(200, {"Content-Type": "text/html"});  
	response.write("Hello, " + request.connection.remoteAddress);
	response.end();
};
