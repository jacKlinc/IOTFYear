function product(a, b) {    
    return a*b;
}

function callbackFunc(product) {    
    console.log("2 seconds later...answer is" + product);
}   

setTimeout(product(1,3), 2000);
//next line gets executed while waiting for the delay to complete
console.log("this is executed while waiting for the callback function");