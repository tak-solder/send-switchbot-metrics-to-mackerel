import * as crypto from "crypto";
import {Buffer} from "buffer";

const switchbotApiUrl = 'https://api.switch-bot.com/v1.1';

export const fetchGet = async <ResponseBody>(path: string) => {
  const t = Date.now().toString();
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

  console.log(switchbotApiUrl + path);
  console.log(headers);

  const res = await fetch(switchbotApiUrl + path, {
    method: 'GET',
    headers,
  }).then(res => res.json());

  console.log(res);

  if (res.statusCode !== 100) {
    throw new Error(`Response status was ${res.statusCode}: ${res.message}`);
  }

  return res.body as ResponseBody;
};
