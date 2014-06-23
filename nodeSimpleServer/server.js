var http = require("http"),							// require HTTP library
	server = http.createServer(respondToClient);	// create a server with a callback

server.listen(8080);				// start the server listening

// let the user know you started:
console.log('Server is listening on port 8080');

// this is the callback function that's called
// whenever a client makes a request:
function respondToClient(request, response) {  
	console.log("request from: ");
	console.log(request.connection.remoteAddress);
		
	console.log("URL:");
	console.log(request.url);
		
	// write back to the client:
	response.writeHead(200, {"Content-Type": "text/html"});  
	response.write("Hello, " + request.connection.remoteAddress);
	response.end();
};
