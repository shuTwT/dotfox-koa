import UAParser from "ua-parser-js";
import log4js from "./utils/log4js.js";
import { LoginUser } from "./core/model/LoginUser.js";


declare global {
  namespace globalThis {
    var native: unknown;
  }

  interface Window {}
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function (): string {
    return this.toString();
};

declare module "koa" {
  interface DefaultState {
    [key: string]: any;
  }
  interface Context {
    log4js: typeof log4js;
    render: (relPath: string, locals?: object) => Promise<string>;
    ua: UAParser.UAParserInstance;
    getLoginUser: () => LoginUser;
  }
}

interface DotEnv {
  DATABASE_URL: string;
  APP_PORT: number;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_KEY_PREFIX: string;
  /** 演示模式 */
  DEMO_MODE:boolean;
  [key:string]:number|string|boolean
}

const wrapperEnv = (envConf: Record<string, any>) => {
  const ret: DotEnv = {
    DATABASE_URL: "",
    APP_PORT: 3000,
    REDIS_HOST: "",
    REDIS_PORT: 6379,
    REDIS_KEY_PREFIX: "",
    DEMO_MODE:false
  };

};

export {};
