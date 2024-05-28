import { BaseController } from "app/common/base/baseController";
import { parseQuery, str2num } from "app/utils/utils";

export default class ListenerController extends BaseController {
  async list(ctx: AppRouterContext, next: Next) {
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
  async export(ctx: AppRouterContext, next: Next) {}
  async getInfo(ctx: AppRouterContext, next: Next) {}
  async add(ctx: AppRouterContext, next: Next) {
    const body = ctx.request.body;
    /**
     * 名称
     */
    const name = body.name;
    /**
     * 监听类型
     */
    const listenType = body.listenType;
    /**
     * 时间类型
     */
    const eventType = body.eventType;
    /**
     * 值类型
     */
    const valueType = body.valueType;
    /**
     * 执行内容
     */
    const value = body.value;
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
  async edit(ctx: AppRouterContext, next: Next) {
    const body = ctx.request.body;
    /**
     * 名称
     */
    const name = body.name;
    /**
     * 监听类型
     */
    const listenType = body.listenType;
    /**
     * 时间类型
     */
    const eventType = body.eventType;
    /**
     * 值类型
     */
    const valueType = body.valueType;
    /**
     * 执行内容
     */
    const value = body.value;
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
  async remove(ctx: AppRouterContext, next: Next) {
    const body = ctx.request.body;
    /**
     * 名称
     */
    const name = body.name;
    /**
     * 监听类型
     */
    const listenType = body.listenType;
    /**
     * 时间类型
     */
    const eventType = body.eventType;
    /**
     * 值类型
     */
    const valueType = body.valueType;
    /**
     * 执行内容
     */
    const value = body.value;
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
}
