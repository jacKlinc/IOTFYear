function callbackFunc(x, y) { // takes two variables: x, y
    console.log("2 seconds later...answer is " + x*y); // prints product
}

setTimeout(callbackFunc, 2000, 4, 6); // pass a function with timeout and integers
//next line gets executed while waiting for the delay to complete
console.log("this is executed while waiting for the callback function" );
