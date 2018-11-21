var mqtt 	= require('mqtt');											// includes npm libraries
var noble 	= require('noble');
var client 	= mqtt.connect('mqtt://broker.mqttdashboard.com');
var ledState = false, serviceNo = 2;									// ledState (on/off), serviceNo (LED/Mag/Accel)

console.log("Started");

/* *************** Events **************** */

noble.on('stateChange', stateChangeEventHandler); 						// calls to determine state change
noble.on('discover', discoverDeviceEventHandler); 						// find device callback
client.on('message' , messageCallBack);									// accepts a message, necessary for input 
client.on('connect' , connectCallBack);                                 // initialises connection with MQTT

/* *************** MQTT **************** */

function messageCallBack(topic, message) {								// this determines what the user wants to do
	console.log("Message recieved");
	if(message == 'baby where?') {										// if this string is 'led on'
		ledState = true, serviceNo = 2;                                 // led switched on, led service selected
		console.log("LED is on");
		peripheralGlobal.discoverServices([], discoverServicesCallback);// calls function to sort services
	} else if(message == 'baby found')	{
		ledState = false, serviceNo = 2;								// state is off, in LED service
		console.log("LED is off");
		peripheralGlobal.discoverServices([], discoverServicesCallback);
	}else if(message == 'baby heading?') {                              // what direction is device?
		serviceNo = 3;                                                  // magService selected
		console.log("Mag");
		peripheralGlobal.discoverServices([], discoverServicesCallback); 
	} else if(message == 'baby good?') {                                // acceleration of device
		serviceNo = 4;                                                  // accelService selected
		console.log("Accel");
		peripheralGlobal.discoverServices([], discoverServicesCallback); 
	} else if(message == 'exit') {                                      // the user wants to exit               
        peripheralGlobal.disconnect(disconnectCallback);
        console.log("Disconected");
    }
}

function publishCallBack(error) {
	if (error) {
		console.log("error publishing data");
	} else {
		console.log("    ");
	}
}

/* *************** Noble **************** */

function stateChangeEventHandler(state) { 								//event handler callback function
	if (state === 'poweredOn') {                                        // is device powered on
		console.log("starting scanning");                               
		noble.startScanning();                                          // start scan
	} else {                                                            // if not on
		console.log("stopping scanning");                              
		noble.stopScanning();                                           // stop scan
	}
}

function discoverDeviceEventHandler(peripheral) { 						//event handler callback function for when discover event occurs
	console.log('Found device: ' + peripheral.advertisement.localName); // logs Mufasa
	console.log("Peripheral UUID: " + peripheral.uuid);
    if (peripheral.uuid == "f00a6eae7c20") { 							// MAC Addr of micro
        peripheralGlobal = peripheral;  								
		peripheral.connect(connectCallback);							// calls connectCallback to subscribe													
	} 
}

function connectCallback(error) { 										// returns device name
	if (error) {
		console.log("error connecting to peripheral");
	} else {		
		console.log('Connected to peripheral: ' + "   " + peripheralGlobal.advertisement.localName);
		peripheralGlobal.discoverServices([], discoverServicesCallback); // jumps to services function
	}
}

function discoverServicesCallback(error, services) { 					// takes services and sends to characteristics
	if (error) {
		console.log("error discovering services");
	} else {
		console.log("Services");			
		var deviceInformationService = services[serviceNo]; 			// selecting a service in the device, specified by number
		deviceInformationService.discoverCharacteristics(null, discoverCharsCallback); // calls chars callback
	}
}

function discoverCharsCallback(error, characteristics) { 		        // used to decide which service to display		
	if (error) {
		console.log("error discovering characteristics");
	} else {
		if(serviceNo == 2) {						                    // is it service 2
			var sensorLevelData = characteristics[0];
			if(ledState == true) {                                      // is the led set
				sensorLevelData.write(new Buffer([ledState]), false , writeCallBackError);// change ledState to on
			} else {
				sensorLevelData.write(new Buffer([ledState]), false , writeCallBackError);// change ledState to off
			}
			var ledString = ledState.toString();                        // converts bool to string
			client.publish('JackIOT/yo', ledString, publishCallBack);   // publishes state of LED
			client.unsubscribe('JackIOT/yo');
			client.subscribe('JackIOT/yo');
		} else if(serviceNo == 3 || serviceNo == 4) {										// if direction is selected (service 3)
			for (var i in characteristics) {                            // iterates through characteristics to print X, Y, Z
				var sensorLevelData = characteristics[i];                       
                if(serviceNo == 4){
                    sensorLevelData.read(readAccel);
                } else{
                    sensorLevelData.read(readMag);// jumps to readMag
                }
                client.unsubscribe('JackIOT/yo');
				client.subscribe('JackIOT/yo');
            }
        }
	}
}

function readMag(error, data) { 										// prints accel data
	if (error) {
		console.log("error reading data");
	} else {
		var mag = data.toString('hex');								    // converts X, Y, Z on each iteration of for loop
		client.publish('JackIOT/yo', 'Baby direction: ' + mag, publishCallBack); // publishes the heading of device
	}
}

function readAccel(error, data) { 										// prints accel data
	if (error) {
		console.log("error reading data");
	} else {
		var accel = data.toString('hex');								// same as readMag
		client.publish('JackIOT/yo', 'Baby hex: ' + accel, publishCallBack); // publishes acceleration of device
	}
}

function writeCallBackError(error) {                                    // logs error when called
	if(error) {
		console.log("write error");
	} 
}

function disconnectCallback(error) { 									// this will be executed when the disconnect request returns
	if (error) {
		console.log("error disconnecting");
	} else {
		console.log("Disconnecting and stopping scanning");
	}
}
