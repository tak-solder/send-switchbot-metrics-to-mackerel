// Copy for use to meter/devices.ts
import {MeterDevice} from "./type";

export const devices: MeterDevice[] = [
  {
    // `Get device list API`で得られる温湿度計のdeviceId
    // Meter/Meter Plus/Outdoor Meter が利用可能
    id: "yourMeterDeviceId",
    // Mackerelには `switchbot.(temperature|humidity|battery).${deviceName}` という名称のサービスメトリクスを送信する
    name: "deviceName",
  }
];
