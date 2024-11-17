export interface BluetoothDeviceWithGATT extends BluetoothDevice {
  gatt?: {
    connect(): Promise<BluetoothRemoteGATTServer>;
  };
}

export interface BluetoothRemoteGATTServer {
  getPrimaryService(service: string): Promise<BluetoothRemoteGATTService>;
}

export interface BluetoothRemoteGATTService {
  getCharacteristic(characteristic: string): Promise<BluetoothRemoteGATTCharacteristic>;
}

export interface BluetoothRemoteGATTCharacteristic {
  startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
  addEventListener(
    type: string,
    listener: (event: { target: { value: DataView } }) => void
  ): void;
  value?: DataView;
}

export interface DiagnosticData {
  mileage: number;
  fuelLevel: number;
  engineTemp: number;
  engineRpm: number;
  vehicleSpeed: number;
  throttlePosition: number;
  diagnosticCodes: string[];
}