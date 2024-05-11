export function seedConfigs(datetime: Date) {
  const configs = [
    {
      configId: 1,
      configKey: "sys.account.register",
      configName: "是否允许注册用户",
      configType: "0",
      configValue: "false",
      createBy: "admin",
      createTime: datetime,
      updateBy:'',
      updateTime:null,
      remark:null
    },
    {
      configId: 2,
      configKey: "sys.account.captcha",
      configName: "验证码开关",
      configType: "0",
      configValue: "false",
      createBy: "admin",
      createTime: datetime,
      updateBy:'',
      updateTime:null,
      remark:null
    },
    {
      configId: 3,
      configName: "uid",
      configKey: "blive.uid",
      configValue: "",
      configType: "1",
      createBy: "admin",
      createTime: datetime,
      updateBy:'',
      updateTime:null,
      remark:null
    },
    {
      configId: 4,
      configName: "buvid",
      configKey: "blive.cookies.buvid",
      configValue: "",
      configType: "1",
      createBy: "admin",
      createTime: datetime,
      updateBy:'',
      updateTime:null,
      remark:null
    },
    {
      configId: 5,
      configName: "直播间id",
      configKey: "blive.roomId",
      configValue: "",
      configType: "1",
      createBy: "admin",
      createTime: datetime,
      updateBy:'',
      updateTime:null,
      remark:null
    },
    {
      configId: 6,
      configName: "sessData",
      configKey: "live.cookies.SESSDATA",
      configValue: "",
      configType: "1",
      createBy: "admin",
      createTime: datetime,
      updateBy:'',
      updateTime:null,
      remark:null
    },
    {
      configId: 7,
      configName: "dedeUserId",
      configKey: "blive.dedeUserID",
      configValue: "",
      configType: "1",
      createBy: "admin",
      createTime: datetime,
      updateBy:'',
      updateTime:null,
      remark:null
    },
    {
      configId: 8,
      configName: "bili_ticket",
      configKey: "blive.cookies.bili_ticket",
      configValue: "",
      configType: "1",
      createBy: "admin",
      createTime: datetime,
      updateBy:'',
      updateTime:null,
      remark:null
    },
    {
      configId: 9,
      configName: "bili_ticket_expires",
      configKey: "blive.cookies.bili_ticket_expires",
      configValue: "",
      configType: "1",
      createBy: "admin",
      createTime: datetime,
      updateBy:'',
      updateTime:null,
      remark:null
    },
    {
      configId: 10,
      configName: "bili_jct",
      configKey: "blive.cookies.bili_jct",
      configValue: "",
      configType: "1",
      createBy: "admin",
      createTime: datetime,
      updateBy:'',
      updateTime:null,
      remark:null
    },
  ];
  return configs;
}
