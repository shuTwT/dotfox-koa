import { BaseController } from "app/common/base/baseController";
import { BpmnService } from "app/service/bpmnService";
import prisma from "app/utils/prisma";
import { parseQuery, str2num } from "app/utils/utils";

const bpmnService = new BpmnService();
export default class FlowableController extends BaseController {
  /**
   * 流程定义列表
   */
  async definitionList(ctx: AppRouterContext, next: Next) {
    const query = ctx.query;
    const pageSize = str2num(parseQuery(query, "pageSize"), 10);
    const pageNum = str2num(parseQuery(query, "pageNum"), 1);
    ctx.body = {
      code: 200,
      msg: "success",
      data: {
        records: [
          {
            id: "flow_5ynxz87h:1:164170",
            name: "flow_hdkjiio4",
            flowKey: "flow_5ynxz87h",
            category: null,
            formName: null,
            formId: null,
            version: 1,
            deploymentId: "164167",
            suspensionState: 1,
            deploymentTime: "2024-05-25 23:59:28",
          },
        ],
        pageSize: 10,
        total: 1,
      },
    };
  }
  /**
   * 新建流程定义
   */
  async createDefinition(ctx: AppRouterContext, next: Next) {
    const body = ctx.request.body;
    const xml = body.xml;

    try {
    const definition = await bpmnService.toDefinitions(xml);
    //   console.log(definition);
      //   await prisma.flow_channel_definition.create({
      //     data: {
      //       id: "",
      //       category: body.category,
      //       name: body.name,
      //     },
      //   });
      const data:any =await bpmnService.toJson(xml)
      const definitions=data['bpmn:definitions']
      const process = definitions['bpmn:process'][0]
      const flowId = process.$.id
      const isExecutable = process.$.isExecutable//是否执行
      const flowName = process.$.name
      ctx.body = {
        code: 200,
        msg: "导入成功",
        data
      };
    } catch (error) {
      ctx.body = {
        code: 200,
        msg: String(error),
      };
    }
  }
  /**
   * 修改流程定义
   */
  async updateDefinition(ctx: AppRouterContext, next: Next) {
    const id = ctx.params["id"];
    const body = ctx.request.body;
    ctx.body = {
      code: 200,
      msg: "修改成功",
    };
  }
  /**
   * 删除流程定义
   */
  async deleteDefinition(ctx: AppRouterContext, next: Next) {
    const id = ctx.params["id"];
    ctx.body = {
      code: 200,
      msg: "删除成功",
    };
  }
  /**
   * 给流程配置主表单
   */
  async addDeployForm(ctx: AppRouterContext, next: Next) {
    const body = ctx.request.body;
    /**
     * 流程编号
     */
    const deployId = body["deployId"];
    /**
     * 表单编号
     */
    const formId = body["formId"];
    ctx.body = {
      code: 200,
      msg: "导入成功",
    };
  }
  /**
   * 表单配置列表
   */
  async formList(ctx: AppRouterContext, next: Next) {
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
   * 新增流程表单
   */
  async createForm(ctx: AppRouterContext, next: Next) {
    const body = ctx.request.body;
    const formName = body["formName"];
    const formContent = body["formContent"];
    const remark = body["remark"];
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
  /**
   * 修改流程表单
   */
  async updateForm(ctx: AppRouterContext, next: Next) {
    const body = ctx.request.body;
    const formName = ctx.params["formName"];
    const formContent = ctx.params["formContent"];
    const remark = ctx.params["remark"];
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
  /**
   * 删除流程表单
   */
  async deleteForm(ctx: AppRouterContext, next: Next) {
    const formName = ctx.params["formName"];
    const formContent = ctx.params["formContent"];
    const remark = ctx.params["remark"];
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
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
