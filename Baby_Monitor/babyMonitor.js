var mqtt 	= require('mqtt');											// includes npm libraries
var client 	= mqtt.connect('mqtt://broker.mqttdashboard.com');
var noble 	= require('noble');
var ledState = false, serviceNo = 2;									// ledState (on/off), serviceNo (LED/Mag/Accel)

const Influx  = require('influx');
const os      = require('os');
const influx  = new Influx.InfluxDB({
  host: 'localhost',
  database: 'Monitor',
  schema: [
    {
      measurement: 'Readings',
      fields: {
        Device: Influx.FieldType.STRING,
        Value: Influx.FieldType.STRING
      },
      tags: [
        'read_os'
      ] 
    }
  ]
})

console.log("Started");

/* *************** Events **************** */

noble.on('stateChange', stateChangeEventHandler); 						// calls to determine state change
noble.on('discover', discoverDeviceEventHandler); 						// find device callback
client.on('message', messageCallBack);									// accepts a message, necessary for input 
//client.on('connect', connectCallback);
/* *************** MQTT **************** */

function messageCallBack(message) {								// this determines what the user wants to do
	console.log("Message recieved");
	if(message == 'baby where?') {										// if this string is 'led on'
		ledState = true, serviceNo = 2;                                 // led switched on, led service selected
		console.log("LED is on");
		peripheralGlobal.discoverServices([], discoverServicesCallback);// calls function to sort services
	} else if(message == 'baby found')	{
		ledState = false, serviceNo = 2;								// state is off, in LED service
		console.log("LED is off");
		peripheralGlobal.discoverServices([], discoverServicesCallback);
	} else if(message == 'baby heading?') {                              // what direction is device?
		serviceNo = 3;                                                  // magService selected
		console.log("Mag");
		peripheralGlobal.discoverServices([], discoverServicesCallback); 
	} else if(message == 'baby good?') {                                // acceleration of device
		serviceNo = 4;                                                  // accelService selected
		console.log("Accel");
		peripheralGlobal.discoverServices([], discoverServicesCallback); 
	} else if(message == 'ten') {                                      // the user wants to exit               
        serviceNo = 5;                                                  // Influx Service selected
		console.log("Influx");
		peripheralGlobal.discoverServices([], discoverServicesCallback); 
    } else if(message == 'exit') {                                      // the user wants to exit               
        peripheralGlobal.disconnect(disconnectCallback);
        console.log("Disconected");
    }
}

// function connectCallback() {
// 	client.subscribe('hup/dup'); 
// }

function disconnectCallback(error) { 									// this will be executed when the disconnect request returns
	if (error) {
		console.log("error disconnecting");
	} else {
		console.log("Disconnecting and stopping scanning");
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
		peripheral.connect(connectCallBack);							// calls connectCallback to subscribe													
	} 
}

function connectCallBack(error) { 										// returns device name
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
			client.publish('hup/dup', ledString);   // publishes state of LED
			unSubPub('hup/dup');
		} else if(serviceNo == 3 || serviceNo == 4) {										// if direction is selected (service 3)
			for (var i in characteristics) {                            // iterates through characteristics to print X, Y, Z
				var sensorLevelData = characteristics[i];                       
                if(serviceNo == 4){
                    sensorLevelData.read(readAccel);
                } else{
                    sensorLevelData.read(readMag);// jumps to readMag
                }
                unSubPub('hup/dup');
            }
        } else {										// if direction is selected (service 3)
			for (var i in characteristics) {                            // iterates through characteristics to print X, Y, Z
				var sensorLevelData = characteristics[i];                       
                sensorLevelData.read(readDB);// jumps to readMag
                unSubPub('hup/dup');
            }
        }
	}
}

function unSubPub(topic){
	client.unsubscribe(topic);
	client.subscribe(topic);
}

function writeCallBackError(error) {                                    // logs error when called
	if(error) {
		console.log("write error");
	} 
}



/************* Reading Devices **************** */
function readMag(error, data) { 										// prints accel data
	if (error) {
		console.log("error reading data");
	} else {
		var mag = data.toString('hex');
		insertDB("Mag", mag);								    // converts X, Y, Z on each iteration of for loop
		client.publish('hup/dup', 'Baby direction: ' + mag); // publishes the heading of device
	}
}

function readAccel(error, data) { 										// prints accel data
	if (error) {
		console.log("error reading data");
	} else {
		var accel = data.toString('hex');
		insertDB("Accel", accel);								// same as readMag
		client.publish('hup/dup', 'Baby hex: ' + accel); // publishes acceleration of device
	}
}

function insertDB(dev, data){
	influx.writePoints([
		{
		  measurement: 'Readings', 
		  tags:   { read_os: os.hostname() },
		  fields: { Device: dev, Value: data },
		}
	]);
}

function readDB(error) { 										// reads DB data
	if (error) {
		console.log("error reading data");
	} else {
		var influxQ = influx.query(`
			select * from Readings
			where read_os = ${Influx.escape.stringLit(os.hostname())} 
			order by time desc
			limit 10
		`).then(rows => { // above query requests all from current host, descending order, max 10
		rows.forEach(row => console.log(`${row.read_os}'s ${row.Device} value was 0x${row.Value}`))
		});
		client.publish('hup/dup', 'Baby hex: ' + influxQ, publishCallBack);
	}
}