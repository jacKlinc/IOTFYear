var fs = require('fs');

fs.readFile("index.html", function (err, data) {
    if (err) console.log(err);
    else console.log(data.toString());		
});
/*
{ [Error: ENOENT: no such file or directory, 
open 'index.html'] errno: -2, code: 'ENOENT', 
syscall: 'open', path: 'index.html' }
*/
