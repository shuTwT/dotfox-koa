import { BaseController } from "app/common/base/baseController";
import prisma from "app/utils/prisma";
import { parseQuery, str2num } from "app/utils/utils";

export default class FlowExpressionController extends BaseController {
  async list(ctx: AppRouterContext, next: Next) {
    const query = ctx.query;
    const pageSize = str2num(parseQuery(query, "pageSize"), 10);
    const pageNum = str2num(parseQuery(query, "pageNum"), 1);
    try {
      const [records, count] = await prisma.$transaction([
        prisma.sysExpression.findMany({
          skip: (pageNum - 1) * pageSize,
          take: pageSize,
        }),
        prisma.sysExpression.count(),
      ]);
      ctx.body = {
        code: 200,
        msg: "success",
        data: {
          records,
          total: count,
          pageSize,
          currentPage: pageNum,
        },
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: String(error),
      };
    }
  }
  async export(ctx: AppRouterContext, next: Next) {}
  async getInfo(ctx: AppRouterContext, next: Next) {}
  async add(ctx: AppRouterContext, next: Next) {
    const body = ctx.request.body;
    const loginUser = ctx.getLoginUser();
    try {
      await prisma.sysExpression.create({
        data: {
          name: body.name,
          expression: body.expression,
          createBy: loginUser.getUserName(),
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
  async edit(ctx: AppRouterContext, next: Next) {
    const id = ctx.params["id"];
    const body = ctx.request.body;
    const loginUser = ctx.getLoginUser();
    try {
      await prisma.sysExpression.update({
        where: {
          id: Number(id),
        },
        data: {
          name: body.name,
          expression: body.expression,
          updateBy: loginUser.getUserName(),
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
  async remove(ctx: AppRouterContext, next: Next) {
    const id = ctx.params["id"];

    try {
      await prisma.sysExpression.delete({
        where: {
          id: Number(id),
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
}
