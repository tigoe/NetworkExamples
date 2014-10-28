/*
	Tests express and websockets without serial

*/

var app = require('express')(),						// start Express framework
  	server = require('http').createServer(app),	// start an HTTP server
 	WebSocketServer = require('ws').Server,
   socketServer = new WebSocketServer({server: server});

server.listen(8080);								// listen for incoming requests on the server
 
// set up your routes: 
app.get('/', getIndexPage);
app.get('/receive', getReceivePage);
app.get('/send', getSendPage);

// respond to web GET requests for the root with some links:
function getIndexPage (request, response) {
	 response.sendFile(__dirname + '/public/index.html');
}
// respond to web GET requests for the receive page:
function getReceivePage(request, response) {
  response.sendFile(__dirname + '/public/receive.html');
}

// respond to web GET request for the send page:
function getSendPage(request, response) {
  response.sendFile(__dirname + '/public/send.html');
}


// listen for new socket.io connections:
socketServer.on('connection', function (socket) {
	// send something to the web client with the data:
	socket.send( "Hello, the date is " + new Date() );
	
		// if the client sends you data, act on it:
	socket.on('message', function(data) {
		console.log('received from client: ' +data);
	});
});

