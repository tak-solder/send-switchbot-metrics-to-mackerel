export type Device = {
  id: string;
  name: string;
};

export type PlugDevice = Device & {
  thresholdWeight?: number;
}


export const MeterDeviceTypes = ['Meter', 'MeterPlus', 'WoIOSensor'] as const;
export type MeterDeviceType = typeof MeterDeviceTypes[number];

export const PlugDeviceTypes = ['Plug Mini (US)', 'Plug Mini (JP)'] as const;
export type PlugDeviceType = typeof PlugDeviceTypes[number];

export type DeviceType = MeterDeviceType | PlugDeviceType;
