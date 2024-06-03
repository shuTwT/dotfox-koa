import { BaseController } from "app/common/base/baseController";
import type Koa from "koa";
import prisma from "app/utils/prisma";
import { parseQuery, str2num } from "app/utils/utils";

export default class RoleController extends BaseController {
  async list(ctx: AppRouterContext, next: Koa.Next) {
    const body = ctx.request.body as any;
    const query = ctx.query;
    const name = parseQuery(query, "name");
    const status = parseQuery(query, "status");
    const code = parseQuery(query, "name");
    let [records,count] = await prisma.$transaction([prisma.sysRole.findMany({
      where: {
        name: {
          contains: name,
        },
        status: status,
        code: code,
      },
    }),prisma.sysRole.count({where: {
        name: {
          contains: name,
        },
        status: status,
        code: code,
      }})]);

    ctx.body = {
      msg: "success",
      data: {
        list:records,
        total: count,
        pageSize: 10,
        currentPage: 1,
      },
    };
  }
  async add(ctx: AppRouterContext, next: Koa.Next) {}
  async edit(ctx: AppRouterContext, next: Koa.Next) {}
  async remove(ctx: AppRouterContext, next: Koa.Next) {}
}
