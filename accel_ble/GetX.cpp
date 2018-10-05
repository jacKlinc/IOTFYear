#include "GetX.h"

GetX::GetX () {
	Xdata[0] = 0x0e;
	Xstatus = i2c.write(MMA8653_ADDRESS,Xdata,1,true);  // Write register number
	Xstatus = i2c.read(MMA8653_ADDRESS,Xdata,1); // Read register contents
		pc.printf("Xdata read=%d\r\n",(int) Xdata[0]);        
	if (Xdata[0]==MMA8653_ID) 
		pc.printf("MMA8653 Found on I2C Bus\r\n");
	else {    
		pc.printf("MMA8653 Not present\r\n");
		while(1); // can't proceed
	}

	Xdata[0]=0x2a; // accel wakeup
	Xdata[1]=1;
	Xstatus = i2c.write(MMA8653_ADDRESS,Xdata,2);  // Write Xdata to register

	while(1){
		Xdata[0]=0x01; // Register number 1 has the X Xdata (2 bytes)
		Xstatus = i2c.write(MMA8653_ADDRESS,Xdata,1,true);  // Write register number
		Xstatus = i2c.read(MMA8653_ADDRESS,Xdata,2); // Read register contents
		X = Xdata[0];
		X = (X << 8) + Xdata[1];
		X = X >> 6; // only 10 bits of Xdata are available   
		pc.printf("X=%d\r\n",X);        
		wait(0.2); 
	}
}