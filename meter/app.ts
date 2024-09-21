import {EventBridgeHandler} from 'aws-lambda';
import {devices} from "./devices";
import {fetchMeterStatuses} from 'libs/switchbot/status';
import {sendServiceMetrics, ServiceMetric} from 'libs/mackerel';

export const lambdaHandler = async (event: EventBridgeHandler<"Scheduled Event", {}, void>): Promise<string> => {
  const statuses = await fetchMeterStatuses(devices);

  const time = Math.floor(Date.now() / 1000);
  const metrics = statuses.map<ServiceMetric[]>(({device, status}) => {
    if (!status) {
      // メトリクスの取得に失敗している場合は何も送信しない
      return [];
    }

    const temperature = status.temperature;
    const humidity = status.humidity;
    const thi = 0.81 * temperature + 0.01 * humidity * (0.99 * temperature - 14.3) + 46.3;

    return [
      {name: `switchbot.temperature.${device.name}`, time, value: temperature},
      {name: `switchbot.humidity.${device.name}`, time, value: humidity},
      {name: `switchbot.thi.${device.name}`, time, value: thi},
      {name: `switchbot.battery.${device.name}`, time, value: status.battery},
    ];
  }).flat();

  await sendServiceMetrics(metrics);

  return 'success';
}
