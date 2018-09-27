var http = require('http');
var fs = require('fs');
var index = fs.readFileSync("index.html");

http.createServer(function (req, res) {
  res.write(index); 
  res.end(); 
}).listen(8080);