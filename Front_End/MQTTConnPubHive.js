/*var requirejs = require('requirejs');

requirejs.config({
   //load the mode modules to top level JS file 
   //by passing the top level main.js require function to requirejs
   nodeRequire: require
});

requirejs(['name1', 'name2'],
   function (name1, name2) {
      //by using requirejs config, name1 and name2 are loaded
      //node's require loads the module, if they did not find these
   }
);

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
})*/
client = new Paho.MQTT.Client("broker.mqttdashboard.com", 8000, "web_" + parseInt(Math.random() * 100, 10)); // random URL

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

//document.getElementById("switch").addEventListener("click", switchLED);

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
}

function publishToBroker(){
    console.log("published");
    client.publish("hup/dup", "pub", 0, false);  //publish a message to the broker
}

function connectToBroker() {
    client.connect(connectOptions);             // connect the client
}

function onConnectCallback() {                  // called when client connect request successful
    // Once a connection has been made, make a subscription and send a message.
    console.log("connected");
    client.publish("hup/dup", "job", 0, true); //publish a message to the broker
    subscribeToTopic();
    switchLED();
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
    client.publish("hup/dup", "baby good?", 0, false);     //
    /*influx.query(`
        select * from Readings
        where Device = ${Influx.escape.stringLit(Device.Accel())}
        order by time desc
        limit 1
    `).then(rows => {
        rows.forEach(row => console.log(`The gateway at ${row.read_os}'s ${row.Device} value was 0x${row.Value}`))
    });*/
}

function connectToMag(){
    console.log("Mag");
    client.publish("hup/dup", "baby heading?", 0, false);     // 
    /*influx.query(`
        select * from Readings
        where Device = ${Influx.escape.stringLit(Device.Mag())}
        order by time desc
        limit 1
    `).then(rows => {
        rows.forEach(row => console.log(`The gateway at ${row.read_os}'s ${row.Device} value was 0x${row.Value}`))
    });*/
}

function connectToLED(){
    console.log("LED");
    /*influx.query(`
        select * from Readings
        where Device = ${Influx.escape.stringLit(Device.LED())}
        order by time desc
        limit 1
    `).then(rows => {
        rows.forEach(row => console.log(`The gateway at ${row.read_os}'s ${row.Device} value was ${row.Value}`))
    });*/
}

function switchLED() {
    var checkBox = document.getElementById("myCheck");  // Get the checkbox
    
    if (checkBox.checked){                      // If checked, display text
        client.publish("hup/dup", "baby where?", 0, false);     // turn on LED 
    } else {
        client.publish("hup/dup", "baby found", 0, false);     // turn off LED 
    }
}