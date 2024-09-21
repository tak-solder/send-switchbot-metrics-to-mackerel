# send-switchbot-metrics-to-mackerel

Switchbot の温度・湿度センサーの値を取得して Mackerel にメトリクスを送信するLambda関数をデプロイするSAMテンプレート。

# 使い方

1. このリポジトリをクローンする
2. 次のファイルをコピーし、中身を編集する
1. `cp samconfig.example.toml. samconfig.yaml`
2. `cp meter/devices.example.ts meter/devices.example.ts`
    - `devices.ts`にご自身のSwitchbotの温湿度計デバイスの名称とデバイスIDを設定してください
    - nameはMackerelにメトリクス送信される際のキーになります
3. `npm run deploy`を実行する
  - デプロイ時に次の変数の入力を求められます
  - `SwitchBotApiToken`: SwitchbotのAPIトークン
  - `SwitchBotApiSecret`: SwitchbotのAPIシークレット
  - `MackerelApiKey`: MackerelのAPIキー
  - `MackerelService`: Mackerelのメトリクスを送信するサービス名
  - `MeterSchedule`: 温湿度計のメトリクス送信間隔
    - [Amazon EventBridgeのスケジュール式定義](https://docs.aws.amazon.com/ja_jp/eventbridge/latest/userguide/eb-create-rule-schedule.html#eb-create-scheduled-rule-schedule)
      で送信スケジュールを設定できます
    - SwitchbotAPI v1.1では **1万回/日** のレート制限があるため、制限内に収まるよう送信間隔を設定してください
    - 関数実行時、SwitchbotAPIには1デバイスあたり1回のAPIリクエストが発生します
