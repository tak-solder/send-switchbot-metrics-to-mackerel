export type Device = {
  id: string;
  name: string;
};

export const MeterDeviceTypes = ['Meter', 'MeterPlus', 'WoIOSensor'] as const;
export type MeterDeviceType = typeof MeterDeviceTypes[number];

export const PlugDeviceTypes = ['Plug Mini (US)', 'Plug Mini (JP)'] as const;
export type PlugDeviceType = typeof PlugDeviceTypes[number];

export type DeviceType = MeterDeviceType | PlugDeviceType;
