// This GetZ class is specifically for the Accelerometer
class GetZ{
    public:
        GetZ();
    private:
        uint16_t Z;
        int Zdata[8]; // buffer for Z coord
        int Zstatus;
        const int MMA8653_ADDRESS = (0x0d<<1);
        const int MMA8653_ID = 0x5a;
		I2C i2c(P0_30, P0_0); // SDA is on P0_30, SCL is on P0_0
		Serial pc(USBTX, USBRX); // sets up serial connection
};

GetZ::GetZ () {
	Zdata[0] = 0x0e;
	Zstatus = i2c.write(MMA8653_ADDRESS,Zdata,1,true);  // Write register number
	Zstatus = i2c.read(MMA8653_ADDRESS,Zdata,1); // Read register contents
		pc.printf("Zdata read=%d\r\n",(int) Zdata[0]);        
	if (Zdata[0]==MMA8653_ID) 
		pc.printf("MMA8653 Found on I2C Bus\r\n");
	else {    
		pc.printf("MMA8653 Not present\r\n");
		while(1); // can't proceed
	}

	Zdata[0]=0x2a; // accel wakeup
	Zdata[1]=1; // it wants to read
	Zstatus = i2c.write(MMA8653_ADDRESS,Zdata,2);  // Write Zdata to register

	while(1){
		Zdata[0]=0x05; // Register number 1 has the Z Zdata (2 bytes)
		Zstatus = i2c.write(MMA8653_ADDRESS,Zdata,1,true);  // Write register number
		Zstatus = i2c.read(MMA8653_ADDRESS,Zdata,2); // Read register contents
		Z = Zdata[0];
		Z = (Z << 8) + Zdata[1];
		Z = Z >> 6; // only 10 bits of Zdata are available   
		pc.printf("Z=%d\r\n",Z);        
		wait(0.2); 
	}
}