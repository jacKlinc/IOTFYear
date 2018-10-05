#ifndef __BLE_Mag_SERVICE_H__
#define __BLE_Mag_SERVICE_H__

class MagService {
public:
    const static uint16_t MagService_UUID              = 0xA022;
    const static uint16_t Mag_VALUE_CHARACTERISTIC_UUID = 0xA023;

    MagService(BLEDevice &_ble, uint16_t initialValueForMagCharacteristic) :
        ble(_ble), MagValue(Mag_VALUE_CHARACTERISTIC_UUID, &initialValueForMagCharacteristic)
    {
        GattCharacteristic *charTable[] = {&MagValue};
        GattService         MagService(MagService_UUID, charTable, sizeof(charTable) / sizeof(GattCharacteristic *));
        ble.addService(MagService);
    }

    GattAttribute::Handle_t getValueHandle() const {
        return MagValue.getValueHandle();
    }
    void updateMagValue(uint16_t newValue) {
        ble.gattServer().write(MagValue.getValueHandle(), (uint8_t *)&newValue, sizeof(uint16_t));
    }

private:
    BLEDevice                         &ble;
    ReadWriteGattCharacteristic<uint16_t>  MagValue;
};

#endif /* #ifndef __BLE_Mag_SERVICE_H__ */
