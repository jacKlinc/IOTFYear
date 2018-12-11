var http = require('http');
var fs = require('fs');
<<<<<<< HEAD
var index = fs.readFileSync("index.html"); // creates variable that stores file

http.createServer(function (req, res) { // creates HTML server
  res.write(index); 
  res.end(); 
}).listen(8080); // checks port 8080
=======
var index = fs.readFileSync("index.html");

http.createServer(function (req, res) {
  res.write(index); 
  res.end(); 
}).listen(8080);
>>>>>>> 0297b3b78f33ce91f04fa7a7fe7d6855aba3631a
