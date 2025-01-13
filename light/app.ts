import {EventBridgeHandler} from 'aws-lambda';
import {devices} from "./devices";
import {fetchLightStatuses} from 'libs/switchbot/status';
import {sendServiceMetrics, ServiceMetric} from 'libs/mackerel';

export const lambdaHandler = async (event: EventBridgeHandler<"Scheduled Event", {}, void>) => {
  const statuses = await fetchLightStatuses(devices);

  const time = Math.floor(Date.now() / 1000);
  const metrics = statuses.map<ServiceMetric[]>(({device, status}) => {
    if (!status) {
      // メトリクスの取得に失敗している場合は何も送信しない
      return [];
    }

    const metrics: ServiceMetric[] = [
      {name: `switchbot.is_running.${device.name}`, time, value: status.power === 'on' ? 1 : 0},
      {name: `switchbot.light.brightness.${device.name}`, time, value: status.brightness},
    ];

    if (typeof status.colorTemperature === 'number') {
      metrics.push({name: `switchbot.light.color_temperature.${device.name}`, time, value: status.colorTemperature});
    }

    return metrics;
  }).flat();

  await sendServiceMetrics(metrics);

  return 'success';
}
