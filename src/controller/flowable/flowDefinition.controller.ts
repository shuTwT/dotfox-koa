import { BaseController } from "app/common/base/baseController";
import prisma from "app/utils/prisma";
import { BpmnService } from "app/service/bpmn.service";
import { parseQuery, str2num } from "app/utils/utils";


const bpmnService = new BpmnService();

export default class FlowDefinitionController extends BaseController {
  async list(ctx: AppRouterContext, next: Next) {
    const query = ctx.query;
    const pageSize = str2num(parseQuery(query, "pageSize"), 10);
    const pageNum = str2num(parseQuery(query, "pageNum"), 1);
    try{
        const [records, count] = await prisma.$transaction([
            prisma.act_re_procdef.findMany({
              skip: (pageNum - 1) * pageSize,
              take: pageSize,
              include:{
                act_re_deployments:true
              }
            }),
            prisma.act_re_deployment.count(),
          ]);
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
    }catch(error){
        ctx.body={
            code:500,
            msg:String(error)
        }
    }
    
  }
  async export(ctx: AppRouterContext, next: Next) {}
  async getInfo(ctx: AppRouterContext, next: Next) {}
  /**
   * 导入流程设计器内xml文件
   */
  async add(ctx: AppRouterContext, next: Next) {
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
  async edit(ctx: AppRouterContext, next: Next) {
    const id = ctx.params["id"];
    const body = ctx.request.body;
    ctx.body = {
      code: 200,
      msg: "修改成功",
    };
  }
  async remove(ctx: AppRouterContext, next: Next) {
    const id = ctx.params["id"];
    ctx.body = {
      code: 200,
      msg: "删除成功",
    };
  }
  async start(ctx: AppRouterContext, next: Next){

  }
  async updateState(ctx: AppRouterContext, next: Next){
    
  }
  /**
   * 指定流程办理人员列表
   */
  async userList(ctx: AppRouterContext, next: Next){
    
  }
    /**
   * 指定流程办理人员组列表
   */
  async roleList(ctx: AppRouterContext, next: Next){
    
  }
    /**
   * 指定流程表达式列表
   */
  async expList(ctx: AppRouterContext, next: Next){
    
  }
}
