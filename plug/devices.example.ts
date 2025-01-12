// Copy for use to meter/devices.ts
import {PlugDevice} from 'libs/device';

export const devices: PlugDevice[] = [
  {
    // `Get device list API`で得られる Plug Mini のdeviceId
    // Plug Mini (US) / Plug Mini (JP) が利用可能
    id: "yourMeterDeviceId",
    // Mackerelには `switchbot.plug.(voltage|weight|electricCurrent).${deviceName}` という名称のサービスメトリクスを送信する
    name: "deviceName",

    // Optional: この値が定義されているとき `switchbot.is_running.${deviceName}` という名称のサービスメトリクスを送信する
    //           weight がこの値より大きい場合は 1 を、それ以外の場合は 0 を送信する
    // thresholdWeight: 10,
  }
];
