// This GetY class is specifically for the Accel.cpp
class GetY{
    public:
        GetY();
    private:
        uint16_t Y;
        int Ydata[8]; // buffer for Y coord
        int Ystatus;
        const int MMA8653_ADDRESS = (0x0d<<1);
        const int MMA8653_ID = 0x5a;
		I2C i2c(P0_30, P0_0); // SDA is on P0_30, SCL is on P0_0
		Serial pc(USBTX, USBRX); // sets up serial connection
};

GetY::GetY () {
	Ydata[0] = 0x0e;
	Ystatus = i2c.write(MMA8653_ADDRESS,Ydata,1,true);  // Write register number
	Ystatus = i2c.read(MMA8653_ADDRESS,Ydata,1); // Read register contents
		pc.printf("Ydata read=%d\r\n",(int) Ydata[0]);        
	if (Ydata[0]==MMA8653_ID) 
		pc.printf("MMA8653 Found on I2C Bus\r\n");
	else {    
		pc.printf("MMA8653 Not present\r\n");
		while(1); // can't proceed
	}

	Ydata[0]=0x2a; // accel wakeup
	Ydata[1]=1;
	Ystatus = i2c.write(MMA8653_ADDRESS,Ydata,2);  // Write Ydata to register

	while(1){
		Ydata[0]=0x03; // Register number 1 has the Y Ydata (2 bytes)
		Ystatus = i2c.write(MMA8653_ADDRESS,Ydata,1,true);  // Write register number
		Ystatus = i2c.read(MMA8653_ADDRESS,Ydata,2); // Read register contents
		Y = Ydata[0];
		Y = (Y << 8) + Ydata[1];
		Y = Y >> 6; // only 10 bits of Ydata are available   
		pc.printf("Y=%d\r\n",Y);        
		wait(0.2); 
	}
}