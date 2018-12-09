var requirejs = require('requirejs');

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
})
client = new Paho.MQTT.Client("broker.mqttdashboard.com", 8000, "web_" + parseInt(Math.random() * 100, 10)); // random URL

document.getElementById("connect").addEventListener("click", connectToBroker); // connects to buttons
document.getElementById("publish").addEventListener("click", publishToBroker); 
document.getElementById("subscribe").addEventListener("click", subscribeToTopic); 

document.getElementsByClassName("bbygood").addEventListener("click", connectToAccel); // connects to buttons;
//document.getElementsByClassName("findbby").addEventListener("click", connectToLED); 
document.getElementsByClassName("direction").addEventListener("click", connectToMag);
document.getElementById("myCheck").addEventListener("click", switchLED);

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
    influx.query(`
        select * from Readings
        where Device = ${Influx.escape.stringLit(Device.Accel())}
        order by time desc
        limit 1
    `).then(rows => {
        rows.forEach(row => console.log(`The gateway at ${row.read_os}'s ${row.Device} value was 0x${row.Value}`))
    });
}

function connectToMag(){
    console.log("Mag");
    influx.query(`
        select * from Readings
        where Device = ${Influx.escape.stringLit(Device.Mag())}
        order by time desc
        limit 1
    `).then(rows => {
        rows.forEach(row => console.log(`The gateway at ${row.read_os}'s ${row.Device} value was 0x${row.Value}`))
    });
}

function connectToLED(){
    console.log("LED");

    influx.query(`
        select * from Readings
        where Device = ${Influx.escape.stringLit(Device.LED())}
        order by time desc
        limit 1
    `).then(rows => {
        rows.forEach(row => console.log(`The gateway at ${row.read_os}'s ${row.Device} value was ${row.Value}`))
    });
}

function myFunction() {
    // Get the checkbox
    var checkBox = document.getElementById("myCheck");
    // Get the output text
    var text = document.getElementById("text");
  
    // If the checkbox is checked, display the output text
    if (checkBox.checked == true){
      text.style.display = "block";
    } else {
      text.style.display = "none";
    }
  }