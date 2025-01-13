import api from "libs/switchbot/api";
import {stdin as input, stdout as output, exit} from "node:process";
import * as readline from "node:readline/promises";

const fetchDeviceList = async () => {
  const rl = readline.createInterface({input, output});

  if (process.env.SWITCHBOT_API_TOKEN === undefined) {
    const token = await rl.question(
      `Enter your  SwitchBotApiToken: `
    );
    if (token.trim() === "") exit(1);
    process.env.SWITCHBOT_API_TOKEN = token;
  }


  if (process.env.SWITCHBOT_API_SECRET === undefined) {
    const secret = await rl.question(
      `Enter your  SwitchBotApiSecret: `
    );
    if (secret.trim() === "") exit(1);
    process.env.SWITCHBOT_API_SECRET = secret;
  }

  return api.fetchGet<any>('/devices');
};

fetchDeviceList().then((res) => {
  console.table(
    res.deviceList.sort((a: any, b: any) => a.deviceType.localeCompare(b.deviceType)),
    ["deviceName", "deviceType", "deviceId", "enableCloudService", "hubDeviceId"]
  );
  exit(0);
}).catch((err) => {
  console.error(err);
  exit(1);
});

