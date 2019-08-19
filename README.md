# IOT_Fourth_Year
All work done on IOT in DT021A/4.

## Assignment 1 (A1) 
Begins with using the Microbit's magnetometer/accelerometer and 
how to print readings to the Terminal. Then using the Android application, the
direction/acceleration can be accessed via BLE (Bluetooth Low Energy) and the I2C 
protocol. 

The acclerometer service written for the Microbit is in the accel_ble2 directory.  
BLE uses GATT (General Attributes Profile) which defines the way in which two BLE
devices communicate with each other, what services they use and what characteristics each 
service has.
The service file (.h) defines the location of the accelerometer registers (found in spec 
sheet) and the functions needed to update the GATT server of register changes.
This is where the data read from the sensor is packaged and sent onto a buffer which is
then sent to another BLE device.  

Downloading 

## Assignment 2 (A2) 
Includes the groundwork for a NodeJS application. Getting used 
to reading/writing files, making use of Node's asynchronous functions, event 
handling, and setting up a basic MQTT broker connection. Uding the Noble (think Node-BLE)
library allows Node and BLE to connect far easier, when the data is in the Node 
envirnonment it can be uploaded to the MQTT broker


