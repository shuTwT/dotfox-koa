import { SysConfig } from "@prisma/client";
import { CacheConstants } from "../../common/constant/CacheConstants";
import prisma from "../../utils/prisma";
import redis from "../../utils/redis";

let isInited = false;

export class SysConfigService {
  constructor() {
    if (!isInited) {
      this.init();
    }
  }
  init() {
    this.loadConfigCache();
  }
  public async selectConfigById(configId: number) {
    const config = await prisma.sysConfig.findUnique({
      where: {
        configId,
      },
    });
    return config;
  }
  /**
   * 根据键名查询参数配置信息
   * @param configKey
   * @returns
   */
  public async selectConfigByKey(configKey: string) {
    const configValue = await redis.get(this.getCacheKey(configKey));
    if (configValue !== null && configValue !== "") {
      return configValue;
    }
    const config = await prisma.sysConfig.findFirst({
      where: {
        configKey,
      },
    });
    if (config) {
      await redis.set(this.getCacheKey(config.configKey), config.configValue);
      return config.configValue;
    }
    return "";
  }
  /**
   * 获取验证码开关
   * @returns
   */
  async selectCaptchaEnabled() {
    const captchaEnabled = await this.selectConfigByKey(
      "sys.account.captchaEnabled"
    );
    if (captchaEnabled === "") {
      return true;
    }
    return Boolean(captchaEnabled);
  }
  /**
   * 加载参数缓存数据
   */
  public async loadConfigCache() {
    const configList = await prisma.sysConfig.findMany();
    for (const config of configList) {
      await redis.set(this.getCacheKey(config.configKey), config.configValue);
    }
  }
  /**
   * 清空参数缓存数据
   */
  async clearConfigCache() {
    const keys = await redis.keys(CacheConstants.SYS_CONFIG_KEY + "");
    await redis.del(keys);
  }
  /**
   * 重置参数缓存数据
   */
  async resetConfigCache() {
    await this.clearConfigCache();
    await this.loadConfigCache();
  }
  getCacheKey(configKey: string) {
    return (CacheConstants.SYS_CONFIG_KEY = configKey);
  }
}
