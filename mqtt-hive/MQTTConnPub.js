//dashboard available at http://www.hivemq.com/demos/websocket-client/
var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://broker.mqttdashboard.com');

console.log("Starting Client");
console.log("Client Started");

client.on('connect', connectCallback); //when a 'connect' event is received call the connectCallback listener function

function connectCallback() {
	client.publish('JackIOT/yo', 'hello world', publishCallback); // publish a message to a topic, JackIOT/yo
	client.subscribe('JackIOT/yo', clientSub); 
}

function publishCallback(error) {     
   	if (error) {
		console.log("error publishing data");
	} else {	 
        console.log("Message is published");
        //client.end(); // Close the connection when published
    }
}

function clientSub(topic, message, packet) {     
	client.subscribe('JackIOT/yo');
	console.log(message.toString());
}