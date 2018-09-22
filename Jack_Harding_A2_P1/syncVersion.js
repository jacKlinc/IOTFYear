var fs = require("fs");

var data = fs.readFileSync('input.txt'); // synchronous version readFile

console.log(data.toString());
console.log("Program Ended");
