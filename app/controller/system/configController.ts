import { BaseController } from "app/common/base/baseController";
import type Koa from "koa";
import prisma from "app/utils/prisma";
import { parseQuery, str2num } from "app/utils/utils";
import dayjs from "dayjs";

export class ConfigController extends BaseController {
  /**
   * @description 获取配置参数列表
   */
  async list(ctx: Koa.Context, next: Koa.Next) {
    const query = ctx.query as any;
    const configName = parseQuery(query, "configName");
    const configKey = parseQuery(query, "configKey");
    const configType = parseQuery(query, "configType");
    const pageSize = str2num(parseQuery(query, "pageSize"), 10);
    const pageNum = str2num(parseQuery(query, "pageNum"), 1);
    try {
      const [list, count] = await prisma.$transaction([
        prisma.sysConfig.findMany({
          where: {
            configName: {
              contains: configName,
            },
            configKey: {
              contains: configKey,
            },
            configType: {
              contains: configType,
            },
          },
          skip: (pageNum - 1) * pageSize,
          take: pageSize,
        }),
        prisma.sysConfig.count({
          where: {
            configName: {
              contains: configName,
            },
            configKey: {
              contains: configKey,
            },
            configType: {
              contains: configType,
            },
          },
        }),
      ]);
      ctx.body = {
        code: 200,
        msg: "success",
        data: {
          list,
          total: count,
        },
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: String(error),
      };
    }
  }
  /**
   * 根据id查询
   */
  async selectConfigById(ctx: Koa.Context, next: Koa.Next) {
    const params = ctx.params;
    const configId = Number(params["configId"]);
    try {
      const config = await prisma.sysConfig.findUnique({
        where: {
          configId,
        },
      });
      ctx.body = {
        code: 200,
        msg: "success",
        data: config,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: String(error),
      };
    }
  }
  /**
   * 根据 key查询
   */
  async selectConfigByKey(ctx: Koa.Context, next: Koa.Next) {
    const params = ctx.params;
    const configKey = params["configKey"];
    try {
      const config = await prisma.sysConfig.findFirst({
        where: {
          configKey,
        },
      });
      ctx.body = {
        code: 200,
        msg: "success",
        data: config,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: String(error),
      };
    }
  }
  /**
   * 新增配置参数
   */
  async createConfig(ctx: Koa.Context, next: Koa.Next) {
    const body = ctx.request.body as any;
    const loginUser = ctx.getLoginUser();
    const date = dayjs();
    try {
      const config = await prisma.sysConfig.create({
        data: {
          configKey: body.configKey,
          configName: body.configName,
          configType: body.configType,
          configValue: body.configValue,
          createBy: loginUser.getUserName(),
          remark: body.remark,
        },
      });
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
  }
  /**
   * 修改配置参数
   */
  async editConfig(ctx: Koa.Context, next: Koa.Next) {
    const params = ctx.params;
    const configId = Number(params["configId"]);
    const body = ctx.request.body as any;
    const loginUser = ctx.getLoginUser();
    const date = dayjs();
    try {
      const config = await prisma.sysConfig.update({
        where: {
          configId,
        },
        data: {
          configKey: body.configKey,
          configName: body.configName,
          configType: body.configType,
          configValue: body.configValue,
          updateBy: loginUser.getUserName(),
          remark: body.remark,
        },
      });
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
  }
  /**
   * 删除配置参数
   */
  async deteleConfig(ctx: Koa.Context, next: Koa.Next) {
    const params = ctx.params;
    const configId = Number(params["configId"]);
    try {
      const config = await prisma.sysConfig.delete({
        where: {
          configId,
        },
      });
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
  }
  /**
   * 刷新配置
   */
  async refreshCache(ctx: Koa.Context, next: Koa.Next) {
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
}
