var print = function(stuff){
	console.log(stuff);
}

function print(stuff){
	console.log(stuff);
}

function main(anotherFunc, value){ // main takes print as a parameter
	anotherFunc(value);
}
main(print, "Hello");