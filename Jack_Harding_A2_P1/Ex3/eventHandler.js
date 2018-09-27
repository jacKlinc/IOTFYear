var events = require('events');
var eventEmitter = new events.EventEmitter();
var eventEmitter2 = new events.EventEmitter(); // second emitter obj

var btEventHandler = function () {
  console.log('discovered a Bluetooth device in the room!');
}

var NFCEventHandler =function () { // second event handler function
  console.log('discovered an NFC device in the room!');
}

eventEmitter.on('BTdiscover', btEventHandler);
eventEmitter2.on('NFCdiscover', NFCEventHandler); // .on() is used to register listeners

eventEmitter.emit('BTdiscover'); // .emit() is used to trigger an event
eventEmitter2.emit('NFCdiscover');