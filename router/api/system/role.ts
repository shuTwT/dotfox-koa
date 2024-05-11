import type { DefaultState, Context } from "koa";
import Router from "koa-router";
import prisma from "../../../utils/prisma";
import { parseQuery, str2num } from "../utils";
import dayjs from "dayjs";

const roleRouter = new Router<DefaultState, Context>({ prefix: "/role" });

/** 获取系统管理-角色管理列表 */
roleRouter.get("/", async (ctx, next) => {
    const body = ctx.request.body as any;
    const query = ctx.query;
    const roleName = parseQuery(query, "name");
    const status = parseQuery(query,'status');
    const code = parseQuery(query, "name");
    let list = await prisma.sysRole.findMany({
      where: {
        roleName: {
          contains: roleName,
        },
        status: status,
        roleKey: code,
      },
    });
    list = list.map((item) => ({
      ...item,
      id: item.roleId,
      name: item.roleName,
      code: item.roleKey,
    }));
    ctx.body = {
      msg: "ok",
      data: {
        list,
        total: list.length,
        pageSize: 10,
        currentPage: 1,
      },
    };
  });

export {roleRouter}