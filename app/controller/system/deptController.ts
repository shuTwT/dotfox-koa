import { BaseController } from "app/common/base/baseController";
import type Koa from "koa";
import prisma from "app/utils/prisma";
import { parseQuery, str2num } from "app/utils/utils";

export default class DeptController extends BaseController {
  /** 获取系统管理-部门管理列表 */
  async list(ctx: AppRouterContext, next: Koa.Next) {
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
  }
}
