import { BaseController } from "app/common/base/baseController";
import prisma from "app/utils/prisma";
import { parseQuery, str2num } from "app/utils/utils";

export default class FlowTaskController extends BaseController{
    /**
   * 我的流程列表
   */
  async myProcessList(ctx: AppRouterContext, next: Next) {
    const query = ctx.query;
    const pageSize = str2num(parseQuery(query, "pageSize"), 10);
    const pageNum = str2num(parseQuery(query, "pageNum"), 1);
    ctx.body = {
      code: 200,
      msg: "success",
      data: {
        records: [],
        pageSize: 10,
        total: 0,
      },
    };
  }
  /**
   * 待办列表
   */
  async todoList(ctx: AppRouterContext, next: Next) {
    const query = ctx.query;
    const pageSize = str2num(parseQuery(query, "pageSize"), 10);
    const pageNum = str2num(parseQuery(query, "pageNum"), 1);
    ctx.body = {
      code: 200,
      msg: "success",
      data: {
        records: [],
        pageSize: 10,
        total: 0,
      },
    };
  }
  /**
   * 结束列表
   */
  async finishedList(ctx: AppRouterContext, next: Next) {
    const query = ctx.query;
    const pageSize = str2num(parseQuery(query, "pageSize"), 10);
    const pageNum = str2num(parseQuery(query, "pageNum"), 1);
    ctx.body = {
      code: 200,
      msg: "success",
      data: {
        records: [],
        pageSizesize: 10,
        total: 0,
      },
    };
  }
}