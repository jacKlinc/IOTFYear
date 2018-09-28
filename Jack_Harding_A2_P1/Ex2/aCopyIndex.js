var fs = require("fs").promises;

fs.copyFile('index.html', 'copyFile.html'); // copies content of index to other file

console.log("Program Ended.");