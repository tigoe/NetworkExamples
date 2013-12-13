This example shows how to use node.js and expres.js to exchange data between client and server in a RESTful way.

To install this project, download all the components in one directory, then run npm install. 

The index.html page has one user-editable field, for a username. There are two buttons, one for getting the username from the server, and another for submitting the username to the server.

The index.js server has four response functions, expecting HTTP GET or POST requests:

GET / serves the index.html page

GET /index* serves the index.html page for any request that starts with "index"

GET /name  sends the client the current value that the server has for a variable called clientName 

POST /name/:name  sets clientName with the value of :name. 

The index.html uses <a href = "http://zeptojs.com/">zepto.js</a> (a lightweight version of jQuery) to make requests to the server. Because the index.html page needs to load zepto.js, the server defines a directory called /js to serve static files. Without that, the index page won't be able to load zepto.js, or any other files.

The index.html page works in an AJAXy way. Rather than having a form that submits everything at once,  it makes requests using zepto.js.  It has a text input field called username, and two buttons, one to submit the username and the other to get the user name from the server. The server replies with short strings of text that the client then fills into the text input field.