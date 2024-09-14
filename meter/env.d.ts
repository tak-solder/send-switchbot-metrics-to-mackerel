declare module 'process' {
  global {
    namespace NodeJS {
      interface ProcessEnv {
        SWITCHBOT_API_TOKEN: string;
        SWITCHBOT_API_SECRET: string;
        MACKEREL_API_KEY: string;
        MACKEREL_SERVICE: string;
      }
    }
  }
}
