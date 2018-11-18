// Combo of both MQTT and node
var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://broker.mqttdashboard.com');
var noble 	= require('noble');														// including the noble library

console.log("Starting Client");
console.log("Client Started");

noble.on('stateChange', stateChangeEventHandler); 									// when a stateChange event occurs call the event handler callback function, discoverDeviceEventHandler
client.on('connect', connectCallback); 												// when a 'connect' event is received call the connectCallback listener function
console.log("Event Discovered");	

function stateChangeEventHandler(state) { 											//event handler callback function
	if (state === 'poweredOn') {													// if device on, scan
		console.log("Noble scan");  
		noble.startScanning();
	} else {																		// if not stop
		console.log("Noble scan fail");  
		noble.stopScanning();
	}
}

noble.on('discover', discoverDeviceEventHandler); 	// when a discover event occurs call the event handler callback function, discoverDeviceEventHandler

function discoverDeviceEventHandler(peripheral) { 									//event handler callback function 
	console.log('Found device: ' + peripheral.advertisement.localName);				// prints name of device to console
	console.log("Peripheral UUID: " + peripheral.uuid);
	//if (peripheral.uuid == "Mufasa"){ 												// UUID of the peripheral
		peripheralGlobal = peripheral;  											// set the peripheralGlobal variable equal to the callback peripheral parameter value
		console.log(peripheral.uuid);
		peripheral.connect(connectCallback); 										//call the connect function and when it returns the callback function connectCallback will be executed
		client.publish('JackIOT/yo', peripheral.uuid, publishCallback); 				// publish a message to a topic, JackIOT/yo
		client.subscribe('JackIOT/yo', clientSub);
		//}
}

function connectCallback(error) { 													//this will be executed when the connect request returns
	if (error) {
		console.log("error connecting to peripheral");
	} else {		
		console.log('connected to peripheral: ' + peripheralGlobal.uuid  + "   " + peripheralGlobal.advertisement.localName);
		peripheralGlobal.discoverServices([], discoverServicesCallback); 			//call the discoverServices function and when it returns the callback function discoverServicesCallback will be executed
	} 
}

function publishCallback(error) {     
   	if (error) {
		console.log("error publishing data");
	} else {	 
        console.log("Message is published");
        //client.end(); // Close the connection when published
    }
}


function clientSub(topic, message, packet) {     // doesn't work
	client.subscribe('JackIOT/yo');
	console.log(message.toString());
}	