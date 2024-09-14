export type MeterDevice = {
  id: string;
  name: string;
};

export type MeterStatusResponse = {
  deviceId: string;
  deviceType: 'Meter' | 'MeterPlus' | 'WoIOSensor';
  hubDeviceId: string;
  battery: number;
  version: string;
  temperature: number;
  humidity: number;
};

export type DeviceStatus = {
  device: MeterDevice,
  status?: MeterStatusResponse,
};

export type ServiceMetric = {
  name: string
  time: number
  value: number
};
