import { BaseController } from "app/common/base/baseController";

export default class FlowableController extends BaseController {
  /**
   * 流程定义列表
   */
  async definitionList(ctx: AppRouterContext, next: Next) {
    ctx.body={
      code:200,
      msg:"success",
      data:{
        records:[
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
            deploymentTime: "2024-05-25 23:59:28"
        }
        ],
        pageSize:10,
        total:1,
      }
    }
  }
  /**
   * 新建流程定义
   */
  async createDefinition(ctx: AppRouterContext, next: Next) {
    /**
     * 流程分类
     **/
    const category = ctx.params['category']
    /**
     * 流程名称
     */
    const name = ctx.params['name']
    /**
     * xml
     */
    const xml = ctx.params['xml']
    ctx.body={
      code:200,
      msg:"导入成功"
    }
  }
  /**
   * 给流程配置主表单
   */
  async addDeployForm(ctx: AppRouterContext, next: Next){
    /**
     * 流程编号
     */
    const deployId=ctx.params['deployId']
    /**
     * 表单编号
     */
    const formId=ctx.params['formId']
    ctx.body={
      code:200,
      msg:"导入成功"
    }
  }
  /**
   * 表单配置列表
   */
  async formList(ctx: AppRouterContext, next: Next) {
    ctx.body={
      code:200,
      msg:"success",
      data:{
        records:[],
        pageSize:10,
        total:0,
      }
    }
  }
  async createForm(ctx: AppRouterContext, next: Next){
    const formName=ctx.params['formName']
    const formContent=ctx.params['formContent']
    const remark = ctx.params['remark']
    ctx.body={
      code:200,
      msg:"success",
    }
  }
  /**
   * 流程表达式列表
   */
  async expressionList(ctx: AppRouterContext, next: Next) {
    ctx.body={
      code:200,
      msg:"success",
      data:{
        records:[],
        pageSize:10,
        total:0,
      }
    }
  }
  async createExpression(ctx: AppRouterContext, next: Next) {
    const name=ctx.params['name']
    const expression = ctx.params['expression']
    const satus=ctx.params['status']
    const remark=ctx.params['remark']
  }
  /**
   * 流程监听器列表
   */
  async listenerList(ctx: AppRouterContext, next: Next) {
    ctx.body={
      code:200,
      msg:"success",
      data:{
        records:[],
        pageSize:10,
        total:0,
      }
    }
  }
  async createListener(ctx: AppRouterContext, next: Next){
    const body=ctx.request.body
    /**
     * 名称
     */
    const name=body.name
    /**
     * 监听类型
     */
    const listenType=body.listenType
    /**
     * 时间类型
     */
    const eventType = body.eventType
    /**
     * 值类型
     */
    const valueType=body.valueType
    /**
     * 执行内容
     */
    const value=body.value
    ctx.body={
      code:200,
      msg:"success"
    }
  }
  /**
   * 我的流程列表
   */
  async myProcessList(ctx: AppRouterContext, next: Next) {
    ctx.body={
      code:200,
      msg:"success",
      data:{
        records:[],
        pageSize:10,
        total:0,
      }
    }
  }
  /**
   * 待办列表
   */
  async todoList(ctx: AppRouterContext, next: Next) {
    ctx.body={
      code:200,
      msg:"success",
      data:{
        records:[],
        pageSize:10,
        total:0,
      }
    }
  }
  /**
   * 结束列表
   */
  async finishedList(ctx: AppRouterContext, next: Next) {
    ctx.body={
      code:200,
      msg:"success",
      data:{
        records:[],
        pageSizesize:10,
        total:0,
      }
    }
  }
}
