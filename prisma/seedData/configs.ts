import { SysConfig } from "@prisma/client";

export const configs = [
    {
      configId: 1,
      configKey: "sys.account.register",
      configName: "是否允许注册用户",
      configType: "0",
      configValue: "false",
      createBy: "admin",
    },
    {
      configId: 2,
      configKey: "sys.account.captcha",
      configName: "验证码开关",
      configType: "0",
      configValue: "false",
      createBy: "admin",
    },
  ] as Partial<SysConfig>[]

