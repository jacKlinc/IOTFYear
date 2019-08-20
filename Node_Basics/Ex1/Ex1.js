var fs = require('fs');

fs.readFile("index.html", function (err, data) {
    if (err) console.log(err); // returns error 
    else console.log(data.toString());	// outputs contents of file	
});

/*******Error Received When Deleted***********

=======
    if (err) console.log(err);
    else console.log(data.toString());		
});
