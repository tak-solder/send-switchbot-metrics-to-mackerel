export type ServiceMetric = {
  name: string;
  time: number;
  value: number;
};

export const sendServiceMetrics = async (metrics: ServiceMetric[]): Promise<void> => {
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
};
