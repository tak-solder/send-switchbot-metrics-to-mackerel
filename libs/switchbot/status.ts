import {
  Device,
  DeviceType, LightDeviceType, LightDeviceTypes,
  MeterDeviceType,
  MeterDeviceTypes,
  PlugDevice,
  PlugDeviceType,
  PlugDeviceTypes
} from "../device";
import {fetchGet} from "./api";

type DeviceStatus<TStatus, TDevice = Device> = {
  device: TDevice;
  status?: StatusResponse<TStatus>;
};

type StatusResponse<TStatus> = {
  deviceId: string;
  deviceType: DeviceType;
  hubDeviceId?: string;
} & TStatus;

type LightStatus = {
  deviceType: LightDeviceType;
  version: string;
  power: string;
  brightness: number;
  color?: string;
  colorTemperature?: number;
};

type LightDeviceStatus = DeviceStatus<LightStatus, LightDevice>;

export const fetchLightStatuses = async (devices: Device[]): Promise<LightDeviceStatus[]> => {
  const promises = devices.map<Promise<LightDeviceStatus>>(async (device) => {
    try {
      const status = await fetchGet<StatusResponse<LightStatus>>(`/devices/${device.id}/status`);

      if (LightDeviceTypes.indexOf(status.deviceType) === -1) {
        throw new Error(`Invalid meter device: type=${status.deviceType}`);
      }

      return {
        device: device,
        status,
      };
    } catch (e) {
      // メトリクスの取得に失敗しても他デバイスのメトリクスは送信したいので、エラーをログに出力して続行する
      console.error(`Failed to get status deviceId=${device.id}: ${e}`);

      return {
        device: device,
        status: undefined,
      };
    }
  });

  return Promise.all(promises);
};


type MeterStatus = {
  deviceType: MeterDeviceType;
  battery: number;
  version: string;
  temperature: number;
  humidity: number;
};

type MeterDeviceStatus = DeviceStatus<MeterStatus>;

export const fetchMeterStatuses = async (devices: Device[]): Promise<MeterDeviceStatus[]> => {
  const promises = devices.map<Promise<MeterDeviceStatus>>(async (device) => {
    try {
      const status = await fetchGet<StatusResponse<MeterStatus>>(`/devices/${device.id}/status`);

      if (MeterDeviceTypes.indexOf(status.deviceType) === -1) {
        throw new Error(`Invalid meter device: type=${status.deviceType}`);
      }

      return {
        device: device,
        status,
      };
    } catch (e) {
      // メトリクスの取得に失敗しても他デバイスのメトリクスは送信したいので、エラーをログに出力して続行する
      console.error(`Failed to get status deviceId=${device.id}: ${e}`);

      return {
        device: device,
        status: undefined,
      };
    }
  });

  return Promise.all(promises);
};

type PlugStatus = {
  deviceType: PlugDeviceType;
  version: string;
  voltage: number;
  weight: number;
  electricityOfDay: number;
  electricCurrent: number;
};

type PlugDeviceStatus = DeviceStatus<PlugStatus, PlugDevice>;

export const fetchPlugStatuses = async (devices: Device[]): Promise<PlugDeviceStatus[]> => {
  const promises = devices.map<Promise<PlugDeviceStatus>>(async (device) => {
    try {
      const status = await fetchGet<StatusResponse<PlugStatus>>(`/devices/${device.id}/status`);

      if (PlugDeviceTypes.indexOf(status.deviceType) === -1) {
        throw new Error(`Invalid meter device: type=${status.deviceType}`);
      }

      return {
        device: device,
        status,
      };
    } catch (e) {
      // メトリクスの取得に失敗しても他デバイスのメトリクスは送信したいので、エラーをログに出力して続行する
      console.error(`Failed to get status deviceId=${device.id}: ${e}`);

      return {
        device: device,
        status: undefined,
      };
    }
  });

  return Promise.all(promises);
};
