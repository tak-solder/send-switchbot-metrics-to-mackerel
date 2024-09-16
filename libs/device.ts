export type Device = {
  id: string;
  name: string;
};

export const MeterDeviceTypes = ['Meter', 'MeterPlus', 'WoIOSensor'] as const;
export type MeterDeviceType = typeof MeterDeviceTypes[number];

export type DeviceType = MeterDeviceType;
