// Extend Navigator interface to include bluetooth property
declare global {
  interface Navigator {
    bluetooth: {
      requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>;
    };
  }

  interface RequestDeviceOptions {
    filters: Array<{ services: string[] }>;
  }
}

export interface BluetoothDevice {
  gatt?: BluetoothRemoteGATTServer;
  id: string;
  name?: string;
}

export interface BluetoothRemoteGATTServer {
  connect(): Promise<BluetoothRemoteGATTServer>;
  getPrimaryService(service: string): Promise<BluetoothRemoteGATTService>;
  connected: boolean;
  disconnect(): void;
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