Node Traceroute

This is a basic traceroute written in node.js.  It takes one argument, the address you want to traceroute to. You can enter a numeric address or a named address, as you can with traceroute. You can't enter any traceroute flags currently. It runs traceroute on the server, and returns text as the trace happens. 

It could be improved, this is just a sketch. You could always use https://npmjs.org/package/traceroute instead, for example.

Part of the point of the exercise was to show how to pass the request and response around so as to make the traceroute non-blocking. I borrowed techniques from http://www.nodebeginner.org/ for this, which is an excellent read.

-Tom Igoe

