<<<<<<< HEAD
function callbackFunc(x, y) { // takes two variables: x, y
    console.log("2 seconds later...answer is " + x*y); // prints product
}

setTimeout(callbackFunc, 2000, 4, 6); // pass a function with timeout and integers
//next line gets executed while waiting for the delay to complete
console.log("this is executed while waiting for the callback function" );
=======
function product(a, b) {    
    return a*b;
}

function callbackFunc(product) {    
    console.log("2 seconds later...answer is" + product);
}   

setTimeout(product(1,3), 2000);
//next line gets executed while waiting for the delay to complete
console.log("this is executed while waiting for the callback function");
>>>>>>> 0297b3b78f33ce91f04fa7a7fe7d6855aba3631a
