import { BaseController } from "app/common/base/baseController";
import type Koa from "koa";
import prisma from "app/utils/prisma";
import { parseQuery, str2num } from "app/utils/utils";
import dayjs from "dayjs";

export default class DictController extends BaseController {
  /**
   * 字典类型列表
   */
  async typeList(ctx: AppRouterContext, next: Koa.Next) {
    const query = ctx.query as any;
    const dictName = parseQuery(query, "dictName");
    const dictType = parseQuery(query, "dictType");
    const status = parseQuery(query, "status");
    const pageSize = str2num(parseQuery(query, "pageSize"), 10);
    const pageNum = str2num(parseQuery(query, "pageNum"), 1);
    try {
      const [types, count] = await prisma.$transaction([
        prisma.sysDictType.findMany({
          where: {
            dictName: {
              contains: dictName,
            },
            dictType: {
              contains: dictType,
            },
            status: status,
          },
          skip: (pageNum - 1) * pageSize,
          take: pageSize,
          orderBy: {
            createTime: "desc",
          },
        }),
        prisma.sysDictType.count({
          where: {
            dictName: {
              contains: dictName,
            },
            dictType: {
              contains: dictType,
            },
            status: status,
          },
        }),
      ]);
      ctx.body = {
        code: 200,
        msg: "success",
        data: {
          list: types,
          total: count,
          pageSize,
          pageNum,
        },
      };
    } catch (error) {
      ctx.log4js.error(error);
      ctx.body = {
        code: 500,
        msg: String(error),
      };
    }
  }
  async typeOptionSelect(ctx: AppRouterContext, next: Koa.Next) {
    const types = await prisma.sysDictType.findMany();
    ctx.body = {
      code: 200,
      msg: "success",
      data: types,
    };
  }
  /**
   * 字典类型详情
   */
  async selectType(ctx: AppRouterContext, next: Koa.Next) {
    const params = ctx.params as any;
    const dictId = Number(params.dictId);
    try {
      const dictType = await prisma.sysDictType.findUnique({
        where: {
          dictId,
        },
      });
      ctx.body = {
        code: 200,
        msg: "success",
        data: dictType,
      };
    } catch (error) {
      ctx.log4js.error(error);
      ctx.body = {
        code: 500,
        msg: String(error),
      };
    }
  }
  /**
   * 字典类型修改
   */
  async editType(ctx: AppRouterContext, next: Koa.Next) {
    const params = ctx.params as any;
    const dictId = Number(params.dictId);
    const body = ctx.request.body as any;
    const loginUser = ctx.getLoginUser();
    const date = dayjs();
    try {
      const dictType = await prisma.sysDictType.update({
        where: {
          dictId,
        },
        data: {
          dictName: body.dictName,
          dictType: body.dictType,
          status: body.status,
          updateBy: loginUser.getUserName(),
          remark: body.remark,
        },
      });
      ctx.body = {
        code: 200,
        msg: "success",
        data: dictType,
      };
    } catch (error) {
      ctx.log4js.error(error);
      ctx.body = {
        code: 500,
        msg: String(error),
      };
    }
  }
  /**
   * 字典类型删除
   */
  async deleteType(ctx: AppRouterContext, next: Koa.Next) {
    const params = ctx.params;
    const dictIds = params["dictIds"].split(",");
    try {
      await prisma.sysDictType.deleteMany({
        where: {
          OR: dictIds.map((item) => ({
            dictId: Number(item),
          })),
        },
      });
    } catch (error) {
      ctx.log4js.error(error);
      ctx.body = {
        code: 500,
        msg: String(error),
      };
    }
  }
  /**
   * 字典类型新增
   */
  async createType(ctx: AppRouterContext, next: Koa.Next) {
    const body = ctx.request.body as any;
    const loginUser = ctx.getLoginUser();
    const date = dayjs();
    try {
      await prisma.sysDictType.create({
        data: {
          dictName: body.dictName,
          dictType: body.dictType,
          status: body.status,
          createBy: loginUser.getUserName(),
          remark: body.remark,
        },
      });
      ctx.body = {
        code: 200,
        msg: "success",
      };
    } catch (error) {
      ctx.log4js.error(error);
      ctx.body = {
        code: 500,
        msg: String(error),
      };
    }
  }
  /**
   * 字段数据列表
   */
  async dataList(ctx: AppRouterContext, next: Koa.Next) {
    const query = ctx.query;
    const dictLabel = parseQuery(query, "dictLabel");
    const dictType = parseQuery(query, "dictType");
    const status = parseQuery(query, "status");
    const pageSize = str2num(parseQuery(query, "pageSize"), 10);
    const pageNum = str2num(parseQuery(query, "pageNum"), 1);
    try {
      const [list, count] = await prisma.$transaction([
        prisma.sysDictData.findMany({
          skip: (pageNum - 1) * pageSize,
          take: pageSize,
          orderBy: {
            dictSort: "asc",
          },
        }),
        prisma.sysDictData.count({
          where: {
            dictType: dictType,
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
      ctx.log4js.error(error);
      ctx.body = {
        code: 500,
        msg: String(error),
      };
    }
  }
  /**
   * 字典数据新增
   */
  async createData(ctx: AppRouterContext, next: Koa.Next) {
    const body = ctx.request.body as any;
    const loginUser = ctx.getLoginUser();
    const date = dayjs();
    try {
      await prisma.sysDictData.create({
        data: {
          dictSort: body.dictSort,
          dictLabel: body.dictLabel,
          dictValue: body.dictValue,
          dictType: body.dictType,
          status: body.status,
          createBy: loginUser.getUserName(),
          remark: body.remark,
        },
      });
      ctx.body = {
        code: 200,
        msg: "success",
      };
    } catch (error) {
      ctx.log4js.error(error);
      ctx.body = {
        code: 500,
        msg: String(error),
      };
    }
  }
  /**
   * 字典数据详情
   */
  async selectData(ctx: AppRouterContext, next: Koa.Next) {
    const params = ctx.params;
    const dictCode = Number(params.dictCode);
    try {
      const dictData = await prisma.sysDictData.findUnique({
        where: {
          dictCode,
        },
      });
      ctx.body = {
        code: 200,
        msg: "success",
        data: dictData,
      };
    } catch (error) {
      ctx.log4js.error(error);
      ctx.body = {
        code: 500,
        msg: String(error),
      };
    }
  }
  /**
   * 字典数据修改
   */
  async editData(ctx: AppRouterContext, next: Koa.Next) {
    const params = ctx.params;
    const dictCode = Number(params.dictCode);
    const body = ctx.request.body as any;
    const loginUser = ctx.getLoginUser();
    const date = dayjs();
    try {
      await prisma.sysDictData.update({
        where: {
          dictCode,
        },
        data: {
          dictSort: body.dictSort,
          dictLabel: body.dictLabel,
          dictValue: body.dictValue,
          dictType: body.dictType,
          status: body.status,
          updateBy: loginUser.getUserName(),
          remark: body.remark,
        },
      });
      ctx.body = {
        code: 200,
        msg: "success",
      };
    } catch (error) {
      ctx.log4js.error(error);
      ctx.body = {
        code: 500,
        msg: String(error),
      };
    }
  }
  /**
   * 字典数据删除
   */
  async deleteData(ctx: AppRouterContext, next: Koa.Next) {
    const params = ctx.params;
    const dictCodes = params["dictCodes"].split(",");
    try {
      await prisma.sysDictData.deleteMany({
        where: {
          OR: dictCodes.map((item) => ({
            dictCode: Number(item),
          })),
        },
      });
    } catch (error) {
      ctx.log4js.error(error);
      ctx.body = {
        code: 500,
        msg: String(error),
      };
    }
  }
}
