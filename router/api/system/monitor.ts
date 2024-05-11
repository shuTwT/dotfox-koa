import type { DefaultState, Context } from "koa";
import jwt, { JwtPayload } from "jsonwebtoken";
import Router from "koa-router";
import prisma from "../../../utils/prisma";
import { parseQuery, str2num } from "../utils";
import dayjs from "dayjs";
import os from "node:os";
import process from "node:process";
import redis from "../../../utils/redis";

const monitorRouter = new Router<DefaultState, Context>({ prefix: "/monitor" });

monitorRouter.get("/online-logs", async (ctx, next) => {
  const keys = await redis.keys("login_tokens:*");
  ctx.log4js.debug(keys.join(','))
  const onlineList = [];
  for (const key of keys) {
    const userToken = await redis.get(key);
    if (userToken) {
      try {
        const { uuid,username, ip, address, system, browser, loginTime } =
          jwt.decode(userToken) as JwtPayload;
        onlineList.push({
          id: uuid,
          username,
          ip,
          address,
          system,
          browser,
          loginTime,
        });
      } catch (error){
        ctx.log4js.error(error)
      }
    }
  }

  ctx.body = {
    code:200,
    msg:"success",
    data: {
      list: onlineList,
      total: onlineList.length,
    },
  };
});
monitorRouter.delete("/offline/:id", async (ctx, next) => {
  const uuid = ctx.params["id"];
  try {
    await redis.del("login_tokens:" + uuid);
    ctx.body = {
      code: 200,
      msg: "success",
    };
  } catch (error) {
    ctx.body = {
      code: 500,
      msg: String(error),
    };
  }
});
/** 获取系统监控-登录日志列表 */
monitorRouter.post("/login-logs", async (ctx, next) => {
  const body = ctx.request.body as any;
  let list = [
    {
      id: 1,
      username: "admin",
      ip: "127.0.0.1",
      address: "中国河南省信阳市",
      system: "macOS",
      browser: "Chrome",
      status: 1, // 登录状态 1 成功 0 失败
      behavior: "账号登录",
      loginTime: new Date(),
    },
    {
      id: 2,
      username: "common",
      ip: "127.0.0.1",
      address: "中国广东省深圳市",
      system: "Windows",
      browser: "Firefox",
      status: 0,
      behavior: "第三方登录",
      loginTime: new Date(),
    },
  ];
  list = list.filter((item) => item.username.includes(body?.username));
  list = list.filter((item) =>
    String(item.status).includes(String(body?.status))
  );
  ctx.body = {
    code:200,
    msg:"success",
    data: {
      list,
      total: list.length, // 总条目数
      pageSize: 10, // 每页显示条目个数
      currentPage: 1, // 当前页数
    },
  };
});
/** 获取系统监控-操作日志列表 */
monitorRouter.post("/operation-logs", async (ctx, next) => {
  const body = ctx.request.body as any;
  let list = [
    {
      id: 1,
      username: "admin",
      ip: "127.0.0.1",
      address: "中国河南省信阳市",
      system: "macOS",
      browser: "Chrome",
      status: 1, // 操作状态 1 成功 0 失败
      summary: "菜单管理-添加菜单", // 操作概要
      module: "系统管理", // 所属模块
      operatingTime: new Date(), // 操作时间
    },
    {
      id: 2,
      username: "common",
      ip: "127.0.0.1",
      address: "中国广东省深圳市",
      system: "Windows",
      browser: "Firefox",
      status: 0,
      summary: "列表分页查询",
      module: "在线用户",
      operatingTime: new Date(),
    },
  ];
  list = list.filter((item) => item.module.includes(body?.module));
  list = list.filter((item) =>
    String(item.status).includes(String(body?.status))
  );
  ctx.body = {
    code:200,
    msg:"success",
    data: {
      list,
      total: list.length, // 总条目数
      pageSize: 10, // 每页显示条目个数
      currentPage: 1, // 当前页数
    },
  };
});
/** 获取系统监控-系统日志列表 */
monitorRouter.post("/system-logs", async (ctx, next) => {
  const body = ctx.request.body as any;
  let list = [
    {
      id: 1, // 日志ID
      /**
       * 日志级别
       * 0 debug调试（最低级别的日志，用于调试和开发阶段）
       * 1 info信息（默认级别，用于记录一般的信息）
       * 2 warn警告（表示可能出现的问题或潜在的错误，但不会影响系统的正常运行）
       * 3 error错误（表示发生了错误，但不会导致系统崩溃）
       * 4 fatal致命（最高级别的日志，表示发生了严重错误，导致系统无法继续运行）
       */
      level: 1,
      module: "菜单管理", // 所属模块
      url: "/menu", // 请求接口
      method: "post", // 请求方法
      ip: "127.0.0.1",
      address: "中国河南省信阳市",
      system: "macOS",
      browser: "Chrome",
      /**
       * 请求耗时（单位：ms 毫秒）
       * 正常耗时：一般认为在几百毫秒（0.1-0.5秒）范围内的请求耗时较为正常
       * 较慢耗时：在1秒以上的耗时可以被认为是较慢的请求，但具体是否较慢还需要根据具体业务场景和性能要求来判断
       */
      takesTime: 10,
      requestTime: new Date(), // 请求时间
    },
    {
      id: 2,
      level: 0,
      module: "地图",
      url: "/get-map-info",
      method: "get",
      ip: "127.0.0.1",
      address: "中国广东省深圳市",
      system: "Windows",
      browser: "Firefox",
      takesTime: 1200,
      requestTime: new Date(),
    },
  ];
  list = list.filter((item) => item.module.includes(body?.module));
  ctx.body = {
    code:200,
    msg:"success",
    data: {
      list,
      total: list.length, // 总条目数
      pageSize: 10, // 每页显示条目个数
      currentPage: 1, // 当前页数
    },
  };
});
/** 获取系统监控-系统日志-根据 id 查日志详情 */
monitorRouter.post("/system-logs-detail", async (ctx, next) => {
  const body = ctx.request.body as any;
  let data;
  if (body.id == 1) {
    data = {
      id: 1,
      level: 1,
      module: "菜单管理",
      url: "/menu",
      method: "post",
      ip: "127.0.0.1",
      address: "中国河南省信阳市",
      system: "macOS",
      browser: "Chrome",
      takesTime: 10,
      responseHeaders: {
        traceId: "1495502411171032",
        "Content-Type": "application/json",
        Connection: "keep-alive",
        "Keep-Alive": "timeout=5",
        "Content-Length": 17019,
      },
      responseBody: {
        success: true,
        data: [
          {
            parentId: 0,
            id: 400,
            menuType: 0,
            title: "menus.hssysMonitor",
            name: "PureMonitor",
            path: "/monitor",
            component: "",
            rank: 11,
            redirect: "",
            icon: "ep:monitor",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            showLink: true,
            showParent: false,
          },
          {
            parentId: 400,
            id: 401,
            menuType: 0,
            title: "menus.hsOnlineUser",
            name: "OnlineUser",
            path: "/monitor/online-user",
            component: "monitor/online/index",
            rank: null,
            redirect: "",
            icon: "ri:user-voice-line",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            showLink: true,
            showParent: false,
          },
          {
            parentId: 400,
            id: 402,
            menuType: 0,
            title: "menus.hsLoginLog",
            name: "LoginLog",
            path: "/monitor/login-logs",
            component: "monitor/logs/login/index",
            rank: null,
            redirect: "",
            icon: "ri:window-line",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            showLink: true,
            showParent: false,
          },
          {
            parentId: 400,
            id: 403,
            menuType: 0,
            title: "menus.hsOperationLog",
            name: "OperationLog",
            path: "/monitor/operation-logs",
            component: "monitor/logs/operation/index",
            rank: null,
            redirect: "",
            icon: "ri:history-fill",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            showLink: true,
            showParent: false,
          },
          {
            parentId: 400,
            id: 404,
            menuType: 0,
            title: "menus.hsSystemLog",
            name: "SystemLog",
            path: "/monitor/system-logs",
            component: "monitor/logs/system/index",
            rank: null,
            redirect: "",
            icon: "ri:file-search-line",
            extraIcon: "",
            enterTransition: "",
            leaveTransition: "",
            activePath: "",
            auths: "",
            frameSrc: "",
            frameLoading: true,
            keepAlive: false,
            hiddenTag: false,
            showLink: true,
            showParent: false,
          },
        ],
      },
      requestHeaders: {
        Accept: "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,eo;q=0.7",
        Authorization: "Bearer eyJhbGciOiJIUzUxMiJ9.admin",
        Connection: "keep-alive",
        "Content-Length": 0,
        Cookie:
          "_ga=GA1.1.231800979.1704562367; _ga_M74ZHEQ1M1=GS1.1.1709299375.7.1.1709299476.0.0.0; Hm_lvt_6a7dac00248d3b6ad8479d7249bb29c5=1709032753,1709359575; Hm_lvt_23a157b7d0d9867f7a51e42628f052f5=1708960489,1709485849,1709879672; authorized-token={%22accessToken%22:%22eyJhbGciOiJIUzUxMiJ9.admin%22%2C%22expires%22:1919520000000}; multiple-tabs=true",
        Host: "192.168.2.121:8848",
        Origin: "http://192.168.2.121:8848",
        Referer: "http://192.168.2.121:8848/",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest",
      },
      requestBody: {
        title: "系统监控",
      },
      traceId: "1495502411171032",
      requestTime: new Date(),
    };
  } else if (body.id == 2) {
   data= {
      id: 2,
      level: 0,
      module: "地图",
      url: "/get-map-info?plateNumber=豫A59778U",
      method: "get",
      ip: "127.0.0.1",
      address: "中国广东省深圳市",
      system: "Windows",
      browser: "Firefox",
      takesTime: 1200,
      responseHeaders: {
        traceId: "2280443117103208",
        "Content-Type": "application/json",
        Connection: "keep-alive",
        "Keep-Alive": "timeout=5",
        "Content-Length": 28693,
      },
      responseBody: {
        plateNumber: "豫A59778U",
        driver: "子骞",
        orientation: 289,
        lng: 113.8564,
        lat: 34.373,
      },
      requestHeaders: {
        Accept: "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8,eo;q=0.7",
        Authorization: "Bearer eyJhbGciOiJIUzUxMiJ9.admin",
        Connection: "keep-alive",
        "Content-Length": 0,
        Cookie:
          "_ga=GA1.1.231800979.1704562367; _ga_M74ZHEQ1M1=GS1.1.1709299375.7.1.1709299476.0.0.0; Hm_lvt_6a7dac00248d3b6ad8479d7249bb29c5=1709032753,1709359575; Hm_lvt_23a157b7d0d9867f7a51e42628f052f5=1708960489,1709485849,1709879672; authorized-token={%22accessToken%22:%22eyJhbGciOiJIUzUxMiJ9.admin%22%2C%22expires%22:1919520000000}; multiple-tabs=true",
        Host: "192.168.2.121:8848",
        Origin: "http://192.168.2.121:8848",
        Referer: "http://192.168.2.121:8848/",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest",
      },
      requestBody: null,
      traceId: "2280443117103208",
      requestTime: new Date(),
    };
  }
  ctx.body={
    code:200,
    msg:"success",
    data
  }
});

/**
 * ServerInfo
 */
export interface ServerInfo {
  cpuInfo: CpuInfo;
  diskInfos: DiskInfo[];
  jvmInfo: JvmInfo;
  memoryInfo: MemoryInfo;
  systemInfo: SystemInfo;
}

/**
 * CpuInfo
 */
export interface CpuInfo {
  cpuNum: number;
  free: number;
  sys: number;
  total: number;
  used: number;
  wait: number;
}

/**
 * DiskInfo
 */
export interface DiskInfo {
  dirName: string;
  free: string;
  sysTypeName: string;
  total: string;
  typeName: string;
  usage: number;
  used: string;
}

/**
 * JvmInfo
 */
export interface JvmInfo {
  free: number;
  home: string;
  inputArgs: string;
  max: number;
  name: string;
  runTime: string;
  startTime: string;
  total: number;
  usage: number;
  used: number;
  version: string;
}

/**
 * MemoryInfo
 */
export interface MemoryInfo {
  free: number;
  total: number;
  usage: number;
  used: number;
}

/**
 * SystemInfo
 */
export interface SystemInfo {
  computerIp: string;
  computerName: string;
  osArch: string;
  osName: string;
  userDir: string;
}

monitorRouter.get("/serverInfo", async (ctx, next) => {
  const cpus = os.cpus();
  const loadavg = os.loadavg().map((load) => load / cpus.length);
  // 当前 node 进程内存使用情况
  const mem = process.memoryUsage();
  // 获取系统空闲内存
  const systemFree = os.freemem()
  // 获取系统总内存
  const systemTotal = os.totalmem()
  const memoryInfo = {
    free: 0,
    total: Math.floor(mem.heapTotal / 1024 / 1024 / 1024 * 100) / 100,
    usage: Math.floor(mem.heapUsed / mem.heapTotal * 100) / 100,
    used: Math.floor(mem.heapUsed / 1024 / 1024 / 1024 * 100) / 100,
  };
  memoryInfo.free = memoryInfo.total - memoryInfo.used
  ctx.body = {
    code: 200,
    msg: "success",
    data: {
      cpuInfo: {
        cpuNum: cpus.length,
        free: 100 - loadavg[0],
        sys: loadavg[0],
        total: loadavg[0],
        used: loadavg[0],
        wait: loadavg[0],
      },
      memoryInfo: {
        free: 0,
        total: 0,
        usage: 0,
        used: 0,
      },
    } as ServerInfo,
  };
});

monitorRouter.get("/cacheInfo", async (ctx, next) => {});

export { monitorRouter };
