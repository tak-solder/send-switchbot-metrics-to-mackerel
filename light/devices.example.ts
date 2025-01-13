// Copy for use to meter/devices.ts
import {Device} from 'libs/device';

export const devices: Device[] = [
  {
    // `Get device list API`で得られる Plug Mini のdeviceId
    // Plug Mini (US) / Plug Mini (JP) が利用可能
    id: "yourMeterDeviceId",
    // Mackerelには `switchbot.plug.(voltage|weight|electricCurrent).${deviceName}` という名称のサービスメトリクスを送信する
    name: "deviceName",
  }
];
