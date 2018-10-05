#ifndef __BLE_Accel_SERVICE_H__
#define __BLE_Accel_SERVICE_H__

class AccelService {
public:
    const static uint16_t AccelService_UUID              = 0xA012;
    const static uint16_t Accel_VALUE_CHARACTERISTIC_UUID = 0xA013;

    AccelService(BLEDevice &_ble, uint16_t initialValueForAccelCharacteristic) :
        ble(_ble), AccelValue(Accel_VALUE_CHARACTERISTIC_UUID, &initialValueForAccelCharacteristic)
    {
        GattCharacteristic *charTable[] = {&AccelValue};
        GattService         AccelService(AccelService_UUID, charTable, sizeof(charTable) / sizeof(GattCharacteristic *));
        ble.addService(AccelService);
    }

    GattAttribute::Handle_t getValueHandle() const {
        return AccelValue.getValueHandle();
    }
    void updateAccelValue(uint16_t newValue) {
        ble.gattServer().write(AccelValue.getValueHandle(), (uint8_t *)&newValue, sizeof(uint16_t));
    }

private:
    BLEDevice                         &ble;
    ReadWriteGattCharacteristic<uint16_t>  AccelValue;
};

#endif /* #ifndef __BLE_Accel_SERVICE_H__ */
