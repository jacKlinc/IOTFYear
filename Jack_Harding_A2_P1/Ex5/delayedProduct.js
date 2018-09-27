function callbackFunc() {    
    console.log("2 seconds later...answer is " + x*y);
}

setTimeout(callbackFunc(2, 4), 2000);
//next line gets executed while waiting for the delay to complete
console.log("this is executed while waiting for the callback function" );
