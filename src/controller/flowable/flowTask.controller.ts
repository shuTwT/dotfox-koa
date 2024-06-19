import { BaseController } from "src/common/base/baseController";
import prisma from "src/utils/prisma";
import { parseQuery, str2num } from "src/utils/utils";

export default class FlowTaskController extends BaseController {
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
   * 停止流程
   */
  async stopProcess(ctx: AppRouterContext, next: Next) {
    const query = ctx.query;
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
  /**
   * 撤销流程
   */
  async revokeProcess(ctx: AppRouterContext, next: Next) {
    const query = ctx.query;
    ctx.body = {
      code: 200,
      msg: "success",
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
  /**
   * 历史流转记录
   */
  async flowRecord(ctx: AppRouterContext, next: Next) {
    const query = ctx.query;
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
  /**
   * 流程初始化表单
   */
  async flowFormData(ctx: AppRouterContext, next: Next) {
    const query = ctx.query;
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
  /**
   * 获取流程变量
   */
  async processVariables(ctx: AppRouterContext, next: Next) {
    const taskId = ctx.params["taskId"];
    const query = ctx.query;
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
  /**
   * 审批任务
   */
  async complete(ctx: AppRouterContext, next: Next) {
    const query = ctx.query;
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
  /**
   * 驳回任务
   */
  async reject(ctx: AppRouterContext, next: Next) {
    const query = ctx.query;
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
  /**
   * 退回任务
   */
  async taskReturn(ctx: AppRouterContext, next: Next) {
    const query = ctx.query;
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
  /**
   * 获取所有可回退节点
   */
  async findReturnTskList(ctx: AppRouterContext, next: Next) {
    const query = ctx.query;
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
  /**
   * 删除任务
   */
  async delete(ctx: AppRouterContext, next: Next) {
    const query = ctx.query;
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
  /**
   * 认领/签收任务
   */
  async claim(ctx: AppRouterContext, next: Next) {
    const query = ctx.query;
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
  /**
   * 取消认领/签收任务
   */
  async unClaim(ctx: AppRouterContext, next: Next) {
    const query = ctx.query;
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
  /**
   * 委派任务
   */
  async delegateTask(ctx: AppRouterContext, next: Next) {
    const query = ctx.query;
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
  /**
   * 任务归还
   */
  async resolveTask(ctx: AppRouterContext, next: Next) {
    const query = ctx.query;
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
  /**
   * 转办任务
   */
  async assignTask(ctx: AppRouterContext, next: Next) {
    const query = ctx.query;
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
  /**
   * 多实例加签
   */
  async addMultiInstanceExecution(ctx: AppRouterContext, next: Next) {
    const query = ctx.query;
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
  /**
   * 多实例减签
   */
  async deleteMultiInstanceExecution(ctx: AppRouterContext, next: Next) {
    const query = ctx.query;
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
  /**
   * 获取下一节点
   */
  async getNextFlowNode(ctx: AppRouterContext, next: Next) {
    const query = ctx.query;
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
  /**
   * 流程发起时获取下一节点
   */
  async getNextFlowNodeByStart(ctx: AppRouterContext, next: Next) {
    const query = ctx.query;
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
  /**
   * 生成流程图
   */
  async genProcessDiagram(ctx: AppRouterContext, next: Next) {
    const query = ctx.query;
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
  /**
   * 获取流程执行节点
   */
  async getFlowViewer(ctx: AppRouterContext, next: Next) {
    const query = ctx.query;
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
  /**
   * 流程节点信息
   */
  async flowXmlAndNode(ctx: AppRouterContext, next: Next) {
    const query = ctx.query;
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
  /**
   * 流程节点表单
   */
  async flowTaskForm(ctx: AppRouterContext, next: Next) {
    const body = ctx.request.body
    const result = {
        formKeyExist:false
    }
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
}
