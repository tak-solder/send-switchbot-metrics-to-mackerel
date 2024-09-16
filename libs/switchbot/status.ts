import {Device, DeviceType, MeterDeviceType, MeterDeviceTypes} from "../device";
import {fetchGet} from "./api";

type DeviceStatus<TStatus> = {
  device: Device;
  status?: StatusResponse<TStatus>;
};

type StatusResponse<TStatus> = {
  deviceId: string;
  deviceType: DeviceType;
  hubDeviceId?: string;
} & TStatus;

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
