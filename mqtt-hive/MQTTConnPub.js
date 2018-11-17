//dashboard available at http://www.hivemq.com/demos/websocket-client/
var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://broker.mqttdashboard.com');

console.log("Starting Client");
console.log("Client Started");

client.on('connect', connectCallback); //when a 'connect' event is received call the connectCallback listener function

function connectCallback() {
	// publish a message to a topic, topic1/test
	client.publish('DT021/jackf', 'hello world', publishCallback);
	client.subscribe('DT021/jackf', clientSub); 
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
	//client.subscribe('DT021/jackf');
	console.log(message.toString());
}