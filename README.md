# IOT_Fourth_Year
All work done on IoT in DT021A/4.

## Assignment 1 (A1) 
Begins with using the Microbit's magnetometer/accelerometer and 
how to print readings to the Terminal. Then using the Android application, the
direction/acceleration can be accessed via BLE (Bluetooth Low Energy) and the I2C 
protocol. 

### Accel/Mag
The acclerometer service written for the Microbit is in the accel_ble2 directory.  
BLE uses GATT (General Attributes Profile) which defines the way in which two BLE
devices communicate with each other, what services they use and what characteristics each 
service has and the name of the device.
The service file (.h) defines the location of the accelerometer registers (found in spec 
sheet) and the functions needed to update the GATT server of register changes.
This is where the data read from the sensor is packaged and sent onto a buffer which is
then sent to another BLE device.  

### BLE Transmission
Sending the recordings was done using BLE Scanner Android app. Bluetooth must first be 
enabled on the phone, all nearby devices can be seen on the app, the name of the Microbit 
can be seen and can be paired and connected.  All availabe services and characteristics can be seen upon 
connection to the device.

## Assignment 2 (A2) 
Includes the groundwork for a NodeJS application. Getting used to reading/writing files, 
making use of Node's asynchronous functions, event handling, and setting up a basic MQTT 
broker connection. Using the Noble (think Node-BLE) library allows Node and BLE to connect
far easier.

### Anonymous Functions 
JavaScript uses anonymous functions to declare a function while calling one.  The function
has no name, this makes for faster development and the function is ran almost immediately 
so there's no need for a name.

### Asynchronous Functions 
Are functions that return a promise when called, when the function returns a value the promise
is fulfilled. In the event of an exception, the promise is rejected. Synchronous functions on the 
other hand, wait for the fucntion to return something before moving on.  Async allows the program 
to continue working while the resource is being read/written, this is escpeccially important in 
IoT where there are so many peripheral devices being used.

### Events
These are objects that create, fire and listen to events that occur. An event handler, handles events, these handlers are then used when registering listeners to that event.

### fs & HTTP
These are modules to handle file systems and to transfer data over HTTP, respectively. 
The file system module allows Node to connect to a local HTML file and write it to a 
HTTP server.  An event listener is then used to listen on port 8080.




