import type { DefaultState, Context } from "koa";
import Router from "koa-router";
import prisma from "../../../utils/prisma";
import { parseQuery, str2num } from "../utils";
import dayjs from "dayjs";

const deptRouter = new Router<DefaultState, Context>({ prefix: "/dept" });

/** 获取系统管理-部门管理列表 */
deptRouter.get("/", async (ctx, next) => {
  const query = ctx.query;
  const deptName = parseQuery(query, "deptName");
  const status = parseQuery(query, "status");
  const pageSize = str2num(parseQuery(query, "pageSize"), 100);
  const pageNum = str2num(parseQuery(query, "pageNum"), 1);
  const list = await prisma.sysDept.findMany({
    where: {
      deptName: {
        contains: deptName,
      },
      status,
    },
    skip: (pageNum - 1) * pageSize,
    take: pageSize,
    orderBy: {
      createTime: "desc",
    },
  });

  const depts = list.map((item) => ({
    ...item,
    id: item.deptId,
    name: item.deptName,
    principal: item.leader,
  }));
  ctx.body = {
    code: 200,
    msg: "success",
    data: depts,
  };
});

export { deptRouter };
