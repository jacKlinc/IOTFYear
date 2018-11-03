/* mbed Microcontroller Library
 * Copyright (c) 2006-2013 ARM Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include "mbed.h"
#include "ble/BLE.h"
#include "LEDService.h"
#include "ADCService.h"
#include "AccelService.h"
#include "GetX.h"
#include "GetY.h"
#include "GetZ.h"

/*
 * All the LEDs on the micro:bit are part of the LED Matrix,
 * In order to get simple blinking behaviour, we set column 0
 * to be permanently at ground. If you want to use the LEDs as
 * a screen, there is a display driver in the micro:bit 'DAL',
 */
DigitalOut col1(P0_4, 0);
DigitalOut alivenessLED(P0_13, 0);
DigitalOut actuatedLED(P0_14, 0);
AnalogIn ADC(P0_3);
uint16_t ADCResult=0;
uint16_t AccelResult=0;
uint16_t XAccel=0;
// Accelerometer : MMA8653FC.  I2C address
I2C i2c(P0_30, P0_0); // SDA is on P0_30, SCL is on P0_0
const int MMA8653_ADDRESS = (0x1d<<1);
const int MMA8653_ID = 0x5a;
// Enable UART for PC communication
Serial pc(USBTX, USBRX);

const static char     DEVICE_NAME[] = "Mufasa";
static const uint16_t uuid16_list[] = {LEDService::LED_SERVICE_UUID,ADCService::ADC_SERVICE_UUID, AccelService::AccelService_UUID};

LEDService *ledServicePtr;
ADCService *ADCServicePtr;
AccelService *AccelServicePtr;
Ticker ticker;

void disconnectionCallback(const Gap::DisconnectionCallbackParams_t *params){
    BLE::Instance().gap().startAdvertising();
}

void periodicCallback(void){
    alivenessLED = !alivenessLED; /* Do blinky on LED1 to indicate system aliveness. */
}

/**
 * This callback allows the LEDService to receive updates to the ledState Characteristic.
 *
 * @param[in] params
 *     Information about the characterisitc being updated.
 */
void onDataWrittenCallback(const GattWriteCallbackParams *params) {
    if ((params->handle == ledServicePtr->getValueHandle()) && (params->len == 1)) {
        actuatedLED = *(params->data);
    }
}

void onDataReadCallback(const GattReadCallbackParams *params) {
    ADCResult=ADC.read_u16();
}
/**
 * This function is called when the ble initialization process has failed
 */
void onBleInitError(BLE &ble, ble_error_t error)
{
    /* Initialization error handling should go here */
}

/**
 * Callback triggered when the ble initialization process has finished
 */
void bleInitComplete(BLE::InitializationCompleteCallbackContext *params){
    BLE&        ble   = params->ble;
    ble_error_t error = params->error;

    if (error != BLE_ERROR_NONE) {
        /* In case of error, forward the error handling to onBleInitError */
        onBleInitError(ble, error);
        return;
    }

    /* Ensure that it is the default instance of BLE */
    if(ble.getInstanceID() != BLE::DEFAULT_INSTANCE) {
        return;
    }

    ble.gap().onDisconnection(disconnectionCallback);
    ble.gattServer().onDataWritten(onDataWrittenCallback);
    ble.gattServer().onDataRead(onDataReadCallback);

    bool initialValueForLEDCharacteristic = false;
    ledServicePtr = new LEDService(ble, initialValueForLEDCharacteristic);
    ADCServicePtr = new ADCService(ble,ADCResult);
    AccelServicePtr = new AccelService(ble,0);

    /* setup advertising */
    ble.gap().accumulateAdvertisingPayload(GapAdvertisingData::BREDR_NOT_SUPPORTED | GapAdvertisingData::LE_GENERAL_DISCOVERABLE);
    ble.gap().accumulateAdvertisingPayload(GapAdvertisingData::COMPLETE_LIST_16BIT_SERVICE_IDS, (uint8_t *)uuid16_list, sizeof(uuid16_list));
    ble.gap().accumulateAdvertisingPayload(GapAdvertisingData::COMPLETE_LOCAL_NAME, (uint8_t *)DEVICE_NAME, sizeof(DEVICE_NAME));
    ble.gap().setAdvertisingType(GapAdvertisingParams::ADV_CONNECTABLE_UNDIRECTED);
    ble.gap().setAdvertisingInterval(1000); /* 1000ms. */
    ble.gap().startAdvertising();
}

int main(void)
{
    ticker.attach(periodicCallback, 0.5); /* Blink LED every second */

    BLE &ble = BLE::Instance();
    ble.init(bleInitComplete);
	// Accel
    /* SpinWait for initialization to complete. This is necessary because the
     * BLE object is used in the main loop below. */
    while (ble.hasInitialized()  == false) { /* spin loop */ }
    char Data[8]; // Declare a buffer for data transfer
    int Status;
    // Verify the device is present on the I2C bus by reading the WHOAMI byte
    Data[0]=0x0d;
    Status = i2c.write(MMA8653_ADDRESS,Data,1,true);  // Write register number
    Status = i2c.read(MMA8653_ADDRESS,Data,1); // Read register contents
    pc.printf("Data read=%d\r\n",(int) Data[0]);
    if (Data[0]==MMA8653_ID)    {
        pc.printf("MMA8653 Found on I2C Bus\r\n");
    } else  {
        pc.printf("MMA8653 Not present\r\n");
        while(1); // can't proceed
    }
    // Wake the accelerometer from sleep mode by writing 1 to register number 0x2a
    Data[0]=0x2a;
    Data[1]=1;
    Status = i2c.write(MMA8653_ADDRESS,Data,2);  // Write data to register

    while (true) {
        ble.waitForEvent();
        ADCResult=ADC.read_u16();
        int16_t X;
        Data[0]=0x01; // Register number 1 has the X data (2 bytes)
        Status = i2c.write(MMA8653_ADDRESS,Data,1,true);  // Write register number
        Status = i2c.read(MMA8653_ADDRESS,Data,2); // Read register contents
        X = Data[0];
        X = (X << 8) + Data[1];
        X = X >> 6; // only 10 bits of data are available
        pc.printf("X=%d\r\n",X);
        wait(0.2);

        int16_t Y;
        Data[0]=0x03; // Register number 1 has the X data (2 bytes)
        Status = i2c.write(MMA8653_ADDRESS,Data,1,true);  // Write register number
        Status = i2c.read(MMA8653_ADDRESS,Data,2); // Read register contents
        Y = Data[0];
        Y = (Y << 8) + Data[1];
        Y = Y >> 6; // only 10 bits of data are available
        pc.printf("Y=%d\r\n",Y);        
        wait(0.2);  
        
        int16_t Z;
        Data[0]=0x05; // Register number 1 has the X data (2 bytes)
        Status = i2c.write(MMA8653_ADDRESS,Data,1,true);  // Write register number
        Status = i2c.read(MMA8653_ADDRESS,Data,2); // Read register contents
        Z = Data[0];
        Z = (Z << 8) + Data[1];
        Z = Z >> 6; // only 10 bits of data are available
        pc.printf("Z=%d\r\n",Z);        
        wait(0.2);
        
        AccelResult=X;
        ADCServicePtr->updateADCValue(ADCResult);
        AccelServicePtr->updateAccelValue(AccelResult);
    }
}
