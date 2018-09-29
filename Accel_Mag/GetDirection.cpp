// classes example
#include "mbed.h"

class GetDirection {
	public:
		GetDirection GetDirection(int data, int magS, const int addr, const int id);
		int getX(int data, const int8_t xC, int magS, int x);
		int getY(int data, const int8_t yC, int magS, int y);
		int getZ(int data, const int8_t zC, int magS, int z);
	private:
		int dataBuffer[8];
		int magStatus;
		int16_t xCoord, yCoord, zCoord;
		const int MMA8653_ID = 0x5a;
		const int8_t MMA8653_OUT_xCoord_MSB = 0x01; // xCoord_MSB in datasheet for both mag & acc
		const int8_t MMA8653_OUT_Y_MSB = 0x03; // yCoord
		const int8_t MMA8653_OUT_Z_MSB = 0x05; // zCoord
		const int MMA8653_ADDRESS_MAG = (0x0e<<1); // bit shifted to fit 7-bit buffer
};

GetDirection::GetDirection(int data, int magS, const int addr, const int id){
	I2C i2c(P0_30, P0_0); // SDA is on P0_30, SCL is on P0_0
	Serial pc(USBTX, USBRX);
	data = dataBuffer;
	magS = magStatus;
	addr = MMA8653_ADDRESS_MAG;
	id = MMA8653_ID;
	data[0] = 0x0e;
	magS = i2c.write(MMA8653_ADDRESS_MAG,data,1,true);  // Write register number
	magS = i2c.read(MMA8653_ADDRESS_MAG,data,1); // Read register contents
		pc.printf("data read=%d\r\n",(int) data[0]);        
	if (data[0]==MMA8653_ID) 
		pc.printf("MMA8653 Found on I2C Bus\r\n");
	else {    
		pc.printf("MMA8653 Not present\r\n");
		while(1); // can't proceed
	}

	data[0]=0x07;
	data[1]=1;
	magS = i2c.write(MMA8653_ADDRESS_MAG,data,2);  // Write data to register
}

void GetDirection::getX (int data, const int8_t xC, int magS, int x) {
	data = dataBuffer;
	xC = MMA8653_OUT_X_MSB;
	magS = magStatus;
	x = xCoord;
	while(1){
		data[0]=MMA8653_OUT_xCoord_MSB; // Register number 1 has the xCoord data (2 bytes)
		magS = i2c.write(MMA8653_ADDRESS_MAG,data,1,true);  // Write register number
		magS = i2c.read(MMA8653_ADDRESS_MAG,data,2); // Read register contents
		xCoord = data[0];
		xCoord = (xCoord << 8) + data[1];
		xCoord = xCoord >> 6; // only 10 bits of data are available   
		pc.printf("xCoord=%d\r\n",xCoord);        
		wait(0.2); 
	}
}

void GetDirection::getY (int data, const int8_t yC, int magS, int y) {
	data = dataBuffer;
	yC = MMA8653_OUT_Y_MSB;
	magS = magStatus;
	y = yCoord;
	while(1){
		data[0]=MMA8653_OUT_Y_MSB; // Register number 1 has the yCoord data (2 bytes)
		magS = i2c.write(MMA8653_ADDRESS_MAG,data,1,true);  // Write register number
		magS = i2c.read(MMA8653_ADDRESS_MAG,data,2); // Read register contents
		yCoord = data[0];
		yCoord = (yCoord << 8) + data[1];
		yCoord = yCoord >> 6; // only 10 bits of data are available   
		pc.printf("yCoord=%d\r\n",yCoord);        
		wait(0.2);
	}
}

void GetDirection::getZ (int data, const int8_t zC, int magS, int z) {
	data = dataBuffer;
	zC = MMA8653_OUT_Z_MSB;
	magS = magStatus;
	z = zCoord;
	while(1){
		// yCoord 
		data[0]=MMA8653_OUT_Y_MSB; // Register number 1 has the yCoord data (2 bytes)
		magS = i2c.write(MMA8653_ADDRESS_MAG,data,1,true);  // Write register number
		magS = i2c.read(MMA8653_ADDRESS_MAG,data,2); // Read register contents
		yCoord = data[0];
		yCoord = (yCoord << 8) + data[1];
		yCoord = yCoord >> 6; // only 10 bits of data are available   
		pc.printf("yCoord=%d\r\n",yCoord);        
		wait(0.2);
	}
}