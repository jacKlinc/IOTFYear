var fs = require('fs');

fs.readFile("index.html", function (err, data) {
<<<<<<< HEAD
    if (err) console.log(err); // returns error 
    else console.log(data.toString());	// outputs contents of file	
});

/*******Error Received When Deleted***********

=======
    if (err) console.log(err);
    else console.log(data.toString());		
});
/*
>>>>>>> 0297b3b78f33ce91f04fa7a7fe7d6855aba3631a
{ [Error: ENOENT: no such file or directory, 
open 'index.html'] errno: -2, code: 'ENOENT', 
syscall: 'open', path: 'index.html' }
*/
