var fs = require("fs").promises;

fs.copyFile('index.html', 'copyFile.html');

console.log("Program Ended.");