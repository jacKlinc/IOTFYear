client = new Paho.MQTT.Client("broker.mqttdashboard.com", 8000, "web_" + parseInt(Math.random() * 100, 10)); // random URL
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

/************* Button Variables **************** */
var LEDOn = document.getElementsByClassName("LEDOn");
for(var i = 0; i < LEDOn.length; i++) {
    LEDOn[i].addEventListener("click", switchLEDOn);
}
var LEDOff = document.getElementsByClassName("LEDOff");
for(var i = 0; i < LEDOn.length; i++) {
    LEDOff[i].addEventListener("click", switchLEDOff);
}
var connectSubClass = document.getElementsByClassName("conSub");
for(var i = 0; i < connectSubClass.length; i++) {
    connectSubClass[i].addEventListener("click", connectToBroker);
}
var accelClass = document.getElementsByClassName("bbygood");
for(var i = 0; i < accelClass.length; i++) {
    accelClass[i].addEventListener("click", connectToAccel);
}
var magClass = document.getElementsByClassName("direction");
for(var i = 0; i < magClass.length; i++) {
    magClass[i].addEventListener("click", connectToMag);
}
var dBClass = document.getElementsByClassName("lastTen");
for(var i = 0; i < dBClass.length; i++) {
    dBClass[i].addEventListener("click", connectToDB);
}

/************* Connection & Subscription **************** */
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
}

function connectToBroker() {
    client.connect(connectOptions);             // connect the client
}

function onConnectCallback() {                  // called when client connect request successful
    console.log("connected");
    client.publish("hup/dup", "job", 0, true);  //publish a message to the broker
    subscribeToTopic();                         // subscribes when connect
}

function onSubCallback() {                 // 
    console.log("subscribed");
    client.publish("hup/dup", "sub", 0, false);             //publish a message to the broker
}

function onConnectionLost(responseObject) {                 // called when the client loses its connection
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:"+responseObject.errorMessage);
    }
}

/************* Button Functions **************** */
function connectToAccel(){
    console.log("Accel");
    client.publish("hup/dup", "baby good?", 0, false);     //
}

function connectToMag(){
    console.log("Mag");
    client.publish("hup/dup", "baby heading?", 0, false);     // 
}

function switchLEDOn(){
    console.log("LED On");
    client.publish("hup/dup", "baby where?", 0, false);     //
}

function switchLEDOff(){
    console.log("LED Off");
    client.publish("hup/dup", "baby found", 0, false);     //
}

function connectToDB(){
    console.log("Last Ten");
    client.publish("hup/dup", "ten", 0, false);     //
}