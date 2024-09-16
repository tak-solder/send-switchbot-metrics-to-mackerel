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

    return [
      {name: `switchbot.temperature.${device.name}`, time , value: status.temperature},
      {name: `switchbot.humidity.${device.name}`, time, value: status.humidity},
      {name: `switchbot.battery.${device.name}`, time, value: status.battery},
    ];
  }).flat();

  await sendServiceMetrics(metrics);

  return 'success';
}
