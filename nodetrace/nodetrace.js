/*
	Traceroute server
	context: node.js
	
	Takes requests for URLs to traceroute, delivers the results in a browser
	
	created 25 Sep 2012
	by Tom Igoe
*/


var exec = require("child_process").exec;	// include exec module
var http = require("http");					// include http module

// announce that the server's started:
	console.log("Server started");
// listen on the server:
http.createServer(function(request, response) {
	// starr the trace:
	trace(request, response);
}).listen(8888);		// keep listening on the server


// perform a traceroute:
function trace(request, response) {
	// get the name of the site to trace:
	var pathname = request.url;
	// remove the leading /:
	while(pathname.charAt(0) === '/') {
		pathname = pathname.substr(1);
	}
	console.log("requested: " + pathname);
	// write a head to the client, so the browser doesn't complain:
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write("Starting trace to " + pathname + "\n\n");
	// start the trace for real:
	var cmd = exec("traceroute " + pathname, function (error, stdout, stderr) {
		// on completion, close the connection to the client:
		response.end("\n\nTrace complete");
	});
	
	// when new data comes in from the trace,pass it to the client:
	cmd.stdout.on('data', function (data) {
		response.write(data);
	});
}
