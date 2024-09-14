import {EventBridgeHandler} from 'aws-lambda';
import * as crypto from "crypto";
import {Buffer} from "buffer";
import {devices} from "./devices";
import {DeviceStatus, ServiceMetric} from "./type";

export const lambdaHandler = async (event: EventBridgeHandler<"Scheduled Event", {}, void>): Promise<string> => {
  const now = Date.now();

  const promises = devices.map<Promise<DeviceStatus>>(async (device) => {
    const t = now.toString();
    const nonce = crypto.randomBytes(16).toString('base64');
    const data = process.env.SWITCHBOT_API_TOKEN + t + nonce;
    const signTerm = crypto.createHmac('sha256', process.env.SWITCHBOT_API_SECRET)
      .update(Buffer.from(data, 'utf-8'))
      .digest();
    const sign = signTerm.toString("base64");

    const headers: Record<string, string> = {
      "Authorization": process.env.SWITCHBOT_API_TOKEN,
      "sign": sign,
      "nonce": nonce,
      "t": t,
    };

    try {
      const res = await fetch(`https://api.switch-bot.com/v1.1/devices/${device.id}/status`, {
        method: 'GET',
        headers,
      }).then(res => res.json());

      if (res.statusCode !== 100) {
        throw new Error(res.message);
      }

      return {
        device: device,
        status: res.body,
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

  const statuses = await Promise.all(promises);
  const time = Math.floor(now / 1000);
  const metrics = statuses.map<ServiceMetric[]>(({device, status}) => {
    if (!status) {
      // メトリクスの取得に失敗している場合は何も送信しない
      return [];
    }

    return [
      {name: `switchbot.temperature.${device.name}`, time , value: status.temperature},
      {name: `switchbot.humidity.${device.name}`, time, value: status.humidity},
      {name: `switchbot.battery.${device.name}`, time, value: status.battery},
    ];
  }).flat();


  const res = await fetch(`https://api.mackerelio.com/api/v0/services/${process.env.MACKEREL_SERVICE}/tsdb`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': process.env.MACKEREL_API_KEY,
    },
    body: JSON.stringify(metrics),
  });

  if (res.status !== 200) {
    throw new Error(`Failed to send metrics: ${res.status} ${await res.text()}`);
  }

  return 'success';
}
