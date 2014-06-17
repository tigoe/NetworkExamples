/*
	Tests express and socket.io without serial

*/

var app = require('express')(),						// start Express framework
  	server = require('http').createServer(app),	// start an HTTP server
  	io = require('socket.io').listen(server);		// filter the server using socket.io

server.listen(8080);								// listen for incoming requests on the server
 
// set up your routes: 
app.get('/', getIndexPage);
app.get('/receive', getReceivePage);
app.get('/send', getSendPage);

// respond to web GET requests for the root with some links:
function getIndexPage (request, response) {
	response.writeHead(200, {'Content-Type': 'text/html'}); 
	response.write("<a href=\"/receive\">receive</a><br>");
	response.write("<a href=\"/send\">send</a><br>");
	response.end();
}
// respond to web GET requests for the receive page:
function getReceivePage(request, response) {
  response.sendfile(__dirname + '/receive.html');
}

// respond to web GET request for the send page:
function getSendPage(request, response) {
  response.sendfile(__dirname + '/send.html');
}

// listen for new socket.io connections:
io.sockets.on('connection', function (socket) {
	// send something to the web client with the data:
	socket.emit('serverData', "Hello");
	
		// if the client sends you data, act on it:
	socket.on('clientData', function(data) {
		console.log('received from client: ' +data);
	});
});

