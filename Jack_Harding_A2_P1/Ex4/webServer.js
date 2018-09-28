var http = require('http');
var fs = require('fs');
var index = fs.readFileSync("index.html"); // creates variable that stores file

http.createServer(function (req, res) { // creates HTML server
  res.write(index); 
  res.end(); 
}).listen(8080); // checks port 8080