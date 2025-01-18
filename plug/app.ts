import {EventBridgeHandler} from 'aws-lambda';
import {devices} from "./devices";
import {fetchPlugStatuses} from 'libs/switchbot/status';
import {sendServiceMetrics, ServiceMetric} from 'libs/mackerel';

export const lambdaHandler = async (event: EventBridgeHandler<"Scheduled Event", {}, void>) => {
    const statuses = await fetchPlugStatuses(devices);

    const time = Math.floor(Date.now() / 1000);
    const metrics = statuses.map<ServiceMetric[]>(({device, status}) => {
        if (!status) {
            // メトリクスの取得に失敗している場合は何も送信しない
            return [];
        }

      const metrics: ServiceMetric[] = [
            {name: `switchbot.plug.voltage.${device.name}`, time, value: status.voltage},
            {name: `switchbot.plug.weight.${device.name}`, time, value: status.weight},
            {name: `switchbot.plug.electricCurrent.${device.name}`, time, value: status.electricCurrent},
        ];

      if (typeof device.thresholdWeight === 'number') {
        metrics.push({
          name: `switchbot.is_running.${device.name}`,
          time,
          value: device.thresholdWeight < status.weight ? 1 : 0,
        });
      }

      return metrics;
    }).flat();

    await sendServiceMetrics(metrics);

    return 'success';
}
