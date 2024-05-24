import { BaseController } from "app/common/base/baseController";

export default class FlowableController extends BaseController {
  /**
   * 流程定义
   */
  async definition(ctx: AppRouterContext, next: Next) {}
  /**
   * 表单配置
   */
  async form(ctx: AppRouterContext, next: Next) {}
  /**
   * 流程表达式
   */
  async expression(ctx: AppRouterContext, next: Next) {}
  /**
   * 流程监听器
   */
  async listener(ctx: AppRouterContext, next: Next) {}
  /**
   * 我的流程列表
   */
  async myProcessList(ctx: AppRouterContext, next: Next) {}
  /**
   * 待办列表
   */
  async todoList(ctx: AppRouterContext, next: Next) {}
  /**
   * 结束列表
   */
  async finishedList(ctx: AppRouterContext, next: Next) {}
}
