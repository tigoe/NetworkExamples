var destination = process.argv[2];			 // get the site name from the command line

console.log(destination);

traceroute = require('traceroute');
traceroute.trace(destination, function (err,hops) {
  if (!err) console.log(hops);
});