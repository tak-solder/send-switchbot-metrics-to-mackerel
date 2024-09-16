# send-switchbot-metrics-to-mackerel

Switchbot の温度・湿度センサーの値を取得して Mackerel にメトリクスを送信するLambda関数をデプロイするSAMテンプレート。

# 使い方

1. このリポジトリをクローンする
2. 次のファイルをコピーし、中身を編集する
  1. `cp samconfig-example.toml. samconfig.yaml`
    - local開発する場合は`default.global.parameters`の各変数の設定が必要です
  2. `cp meter/devices-example.ts meter/devices-example.ts`
    - `devices.ts`にご自身のSwitchbotの温湿度計デバイスの名称とデバイスIDを設定してください
    - nameはMackerelにメトリクス送信される際のキーになります
3. `npm run deploy`を実行する
