#include "mbed.h"

// Accelerometer : MMA8653FC.  I2C address
I2C i2c(P0_30, P0_0); // SDA is on P0_30, SCL is on P0_0
const int MMA8653_ADDRESS = (0x1d<<1); 
const int MMA8653_ADDRESS_MAG = (0x0e<<1); // bit shifted to fit 7-bit buffer
const int MMA8653_ID = 0x5a;
//  X, Y, Z Addresses
const int8_t MMA8653_OUT_X_MSB = 0x01; // X_MSB in datasheet for both mag & acc
const int8_t MMA8653_OUT_Y_MSB = 0x03; // Y
const int8_t MMA8653_OUT_Z_MSB = 0x05; // Z
// Enable UART for PC communication
Serial pc(USBTX, USBRX);

int main() {    
    char Data[8]; // Declare a buffer for data transfer    
    int Status;
    // Verify the device is present on the I2C bus by reading the WHOAMI byte
    // Acc
    Data[0]=0x0d; // reg ADDR of accelerometer
    Status = i2c.write(MMA8653_ADDRESS,Data,1,true);  // Write register number
    Status = i2c.read(MMA8653_ADDRESS,Data,1); // Read register contents
    pc.printf("Data read=%d\r\n",(int) Data[0]);        
    if (Data[0]==MMA8653_ID) 
        pc.printf("MMA8653 Found on I2C Bus\r\n");
    else {    
        pc.printf("MMA8653 Not present\r\n");
        while(1); // can't proceed
    }   
              
    // Wake the accelerometer from sleep mode by writing 1 to register number 0x2a    
    Data[0]=0x2a; 
    Data[1]=1;
    Status = i2c.write(MMA8653_ADDRESS,Data,2);  // Write data to register
    while(1) {
        int16_t X;
        Data[0]=MMA8653_OUT_X_MSB; // Register number 1 has the X data (2 bytes)
        Status = i2c.write(MMA8653_ADDRESS,Data,1,true);  // Write register number
        Status = i2c.read(MMA8653_ADDRESS,Data,2); // Read register contents
        X = Data[0];
        X = (X << 8) + Data[1];
        X = X >> 6; // only 10 bits of data are available   
        pc.printf("X=%d\r\n",X);        
        wait(0.2);   
        
        int16_t Y;
        Data[0]=MMA8653_OUT_Y_MSB; // Register number 1 has the Y data (2 bytes)
        Status = i2c.write(MMA8653_ADDRESS,Data,1,true);  // Write register number
        Status = i2c.read(MMA8653_ADDRESS,Data,2); // Read register contents
        Y = Data[0];
        Y = (Y << 8) + Data[1];
        Y = Y >> 6; // only 10 bits of data are available   
        pc.printf("Y=%d\r\n",Y);        
        wait(0.2);
        
        int16_t Z;
        Data[0]=MMA8653_OUT_Z_MSB; // Register number 1 has the Y data (2 bytes)
        Status = i2c.write(MMA8653_ADDRESS,Data,1,true);  // Write register number
        Status = i2c.read(MMA8653_ADDRESS,Data,2); // Read register contents
        Z = Data[0];
        Z = (Z << 8) + Data[1];
        Z = Z >> 6; // only 10 bits of data are available   
        pc.printf("Z=%d\r\n",Z);        
        wait(0.2);           
    }
    
    // Mag
    Data[0]=0x0e;
    Status = i2c.write(MMA8653_ADDRESS_MAG,Data,1,true);  // Write register number
    Status = i2c.read(MMA8653_ADDRESS_MAG,Data,1); // Read register contents
    pc.printf("Data read=%d\r\n",(int) Data[0]);        
    if (Data[0]==MMA8653_ID) 
        pc.printf("MMA8653 Found on I2C Bus\r\n");
    else {    
        pc.printf("MMA8653 Not present\r\n");
        while(1); // can't proceed
    }   
              
    // Wake the magnetometer from sleep mode by writing 1 to register number 0x07    
    Data[0]=0x07;
    Data[1]=1;
    Status = i2c.write(MMA8653_ADDRESS_MAG,Data,2);  // Write data to register
    while(1) {
        int16_t X_MAG;
        Data[0]=MMA8653_OUT_X_MSB; // Register number 1 has the X data (2 bytes)
        Status = i2c.write(MMA8653_ADDRESS_MAG,Data,1,true);  // Write register number
        Status = i2c.read(MMA8653_ADDRESS_MAG,Data,2); // Read register contents
        X_MAG = Data[0];
        X_MAG = (X_MAG << 8) + Data[1];
        X_MAG = X_MAG >> 6; // only 10 bits of data are available   
        pc.printf("X=%d\r\n",X_MAG);        
        wait(0.2);   
        
        int16_t Y_MAG;
        Data[0]=MMA8653_OUT_Y_MSB; // Register number 1 has the Y data (2 bytes)
        Status = i2c.write(MMA8653_ADDRESS_MAG,Data,1,true);  // Write register number
        Status = i2c.read(MMA8653_ADDRESS_MAG,Data,2); // Read register contents
        Y_MAG = Data[0];
        Y_MAG = (Y_MAG << 8) + Data[1];
        Y_MAG = Y_MAG >> 6; // only 10 bits of data are available   
        pc.printf("Y=%d\r\n",Y_MAG);        
        wait(0.2);
        
        int16_t Z_MAG;
        Data[0]=MMA8653_OUT_Z_MSB; // Register number 1 has the Y data (2 bytes)
        Status = i2c.write(MMA8653_ADDRESS_MAG,Data,1,true);  // Write register number
        Status = i2c.read(MMA8653_ADDRESS_MAG,Data,2); // Read register contents
        Z_MAG = Data[0];
        Z_MAG = (Z_MAG << 8) + Data[1];
        Z_MAG = Z_MAG >> 6; // only 10 bits of data are available   
        pc.printf("Z=%d\r\n",Z_MAG);        
        wait(0.2);           
    }
}