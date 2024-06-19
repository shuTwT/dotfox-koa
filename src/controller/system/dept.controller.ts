import { BaseController } from "src/common/base/baseController";
import type Koa from "koa";
import prisma from "src/utils/prisma";
import { parseQuery, str2num } from "src/utils/utils";

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
  async add(ctx: AppRouterContext, next: Koa.Next) {
    const body = ctx.request.body;
    const { deptName, parentId, leader, phone, email, sort, status, remark } =
      body;
    try {
      const dept = await prisma.sysDept.create({
        data: {
          deptName,
          parentId: Number(parentId),
          leader,
          phone,
          email,
          sort: Number(sort),
          status,
          remark,
        },
      });
      ctx.body = {
        code: 200,
        msg: "success",
        data: dept,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: String(error),
      };
    }
  }
  async edit(ctx: AppRouterContext, next: Koa.Next) {
    const deptId = ctx.params["deptId"];
    const body = ctx.request.body;
    const { deptName, parentId, leader, phone, email, sort, status, remark } =
      body;
    try {
      const dept = await prisma.sysDept.update({
        where: {
          deptId: Number(deptId),
        },
        data: {
          deptName,
          parentId: Number(parentId),
          leader,
          phone,
          email,
          sort: Number(sort),
          status,
          remark,
        },
      });
      ctx.body = {
        code: 200,
        msg: "success",
        data: dept,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: String(error),
      };
    }
  }
  async remove(ctx: AppRouterContext, next: Koa.Next){
    const deptId = ctx.params['deptId']
    try{
        await prisma.sysDept.delete({
            where:{
                deptId: Number(deptId)
            }
        })
        ctx.body={
            code:200,
            msg:"success"
        }
    }catch(error){
        ctx.body = {
            code: 500,
            msg: String(error),
        };
    }
  }
}
