var noble = require('noble');

noble.on('stateChange', stateChangeEventHandler); //when a stateChange event occurs call the event handler callback function, discoverDeviceEventHandler

function stateChangeEventHandler(state) { //event handler callback function
  if (state === 'poweredOn') {
    console.log("starting scanning");  
    noble.startScanning();
  } else {
    console.log("stopping scanning");  
    noble.stopScanning();
  }
}

noble.on('discover', discoverDeviceEventHandler); //when a discover event occurs call the event handler callback function, discoverDeviceEventHandler
console.log("up and running");

function discoverDeviceEventHandler(peripheral) { //event handler callback function 
	console.log('Found device with local name: ' + peripheral.advertisement.localName);
	//console.log('advertising the following service uuid\'s: ' + peripheral.advertisement.serviceUuids);
	console.log("peripheralGlobal" + peripheral.uuid);
	//if (peripheral.advertisement.localName == "BBC micro:bit [gugiv]"){
    if (peripheral.uuid == "xyz"){ //NOTE: this "xyz" value needs to change to match uuid of the periphearl
        peripheralGlobal = peripheral;  //set the peripheralGlobal variable equal to the callback peripheral parameter value
		console.log(peripheral.uuid);
		peripheral.connect(connectCallback); //call the connect function and when it returns the callback function connectCallback will be executed
	}; //end if 
}

function connectCallback(error) { //this will be executed when the connect request returns
	if (error) {
		console.log("error connecting to peripheral");
	} else {		
		console.log('connected to peripheral: ' + peripheralGlobal.uuid  + "   " + peripheralGlobal.advertisement.localName);
		peripheralGlobal.discoverServices([], discoverServicesCallback); //call the discoverServices function and when it returns the callback function discoverServicesCallback will be executed
	}
}

function discoverServicesCallback(error, services) { //this will be executed when the discoverServices request returns
	if (error) {
		console.log("error discovering services");
	} else {
		console.log("The device contains the following services");			
		for (var i in services) {
			console.log('  ' + i + ' uuid: ' + services[i].uuid);
		}
        //pick one service to interrogate
		var deviceInformationService = services[0];
		deviceInformationService.discoverCharacteristics(null, discoverCharsCallback); //call the discoverCharacteristics function and when it returns the callback function discoverCharsCallback will be executed
	}
}

function discoverCharsCallback(error, characteristics) { //this will be executed when the discoverCharacteristics request returns
	if (error) {
		console.log("error discovering characteristics");
	} else {
		console.log('discovered the following characteristics associated with the 6th service:');
		for (var i in characteristics) {
			console.log('  ' + i + ' uuid: ' + characteristics[i].uuid);
        }
        //pick one characteristic to read the value of 
        var sensorLevelData = characteristics[0];
        sensorLevelData.read(readDataCallback); //call the read function and when it returns the callback function readDataCallback will be executedcallback function writeDataCallback will be executed
		} //end for loop
}

function readDataCallback(error, data) { //this will be executed when the read request returns
	if (error) {
		console.log("error reading data");
	} else {	
		console.log("Sensor reading is : " + data.toString('hex'));
		peripheralGlobal.disconnect(disconnectCallback);
	}
}

function disconnectCallback(error){ //this will be executed when the disconnect request returns
	if (error) {
		console.log("error disconnecting");
	} else {
		console.log("Disconnecting and stopping scanning");
	}
}
