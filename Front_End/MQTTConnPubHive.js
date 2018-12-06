//Using Hive broker - dashboard available at http://www.hivemq.com/demos/websocket-client/
//Uses the Paho MQTT JS client library - http://www.eclipse.org/paho/files/jsdoc/index.html to send and receive messages using a web browser
//Example code available at https://www.hivemq.com/blog/mqtt-client-library-encyclopedia-paho-js

// Create a client instance
client = new Paho.MQTT.Client("broker.mqttdashboard.com", 8000, "web_" + parseInt(Math.random() * 100, 10)); // random URL

document.getElementById("connect").addEventListener("click", connectToBroker); // connects to buttons
document.getElementById("publish").addEventListener("click", publishToBroker); 
document.getElementById("subscribe").addEventListener("click", subscribeToTopic); 

document.getElementsByClassName("bbygood").addEventListener("click", connectToAccel); // connects to buttons;
document.getElementsByClassName("findbby").addEventListener("click", connectToLED); 
document.getElementsByClassName("direction").addEventListener("click", connectToMag);
// set callback handlers
//client.onConnected = onConnected;
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;
 
var connectOptions = {
    onSuccess: onConnectCallback                //other options available to set
};
var subscribeOptions = {                         // subscribe requires options
    onSuccess: onSubCallback 
};

function onMessageArrived(message) {
    console.log("onMessageArrived:" + message.payloadString);
}

function subscribeToTopic(){
    client.subscribe("hup/dup", subscribeOptions); // sub to topic, filter=topic
    //client.subscribe("hup/dup");
}

function publishToBroker(){
    console.log("published");
    client.publish("hup/dup", "pub", 0, true);  //publish a message to the broker
}

function connectToBroker() {
    client.connect(connectOptions);             // connect the client
}

function onConnectCallback() {                  // called when client connect request successful
    // Once a connection has been made, make a subscription and send a message.
    console.log("connected");
    client.publish("hup/dup", "con", 0, true); //publish a message to the broker
}

function onSubCallback() {                 // 
    // Once a connection has been made, make a subscription and send a message.
    console.log("subscribed");
    client.publish("hup/dup", "sub", 0, false); //publish a message to the broker
}

function printTopic(message){
    console.log(message);
    client.publish("hup/dup", "sub" + message, 0, false); //publish a message to the broker
}

// called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
    }
}

function connectToAccel(){
    console.log("Accel");
}

function connectToMag(){
    console.log("Mag");
}

function connectToLED(){
    console.log("LED");
}