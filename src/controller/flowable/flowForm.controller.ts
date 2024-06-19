import { BaseController } from "src/common/base/baseController";
import prisma from "src/utils/prisma";
import { parseQuery, str2num } from "src/utils/utils";

export default class FlowFormController extends BaseController {
  /**
   * 给流程配置主表单
   */
  async deploy(ctx: AppRouterContext, next: Next) {
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
  async list(ctx: AppRouterContext, next: Next) {
    const query = ctx.query;
    const pageSize = str2num(parseQuery(query, "pageSize"), 10);
    const pageNum = str2num(parseQuery(query, "pageNum"), 1);
    try {
      const [records, count] = await prisma.$transaction([
        prisma.sysForm.findMany({
          skip: (pageNum - 1) * pageSize,
          take: pageSize,
        }),
        prisma.sysForm.count(),
      ]);
      ctx.body = {
        code: 200,
        msg: "success",
        data: {
          records,
          total: count,
          pageSize,
          currentPage: pageNum,
        },
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: String(error),
      };
    }
  }
  /**
   * 新增流程表单
   */
  async add(ctx: AppRouterContext, next: Next) {
    const body = ctx.request.body;
    try {
        await prisma.sysForm.create({
            data:{
                formName:body.formName,
                formContent:"",
                category:body.category,
                remark:body.remark
            }
        })
        ctx.body={
            code:200,
            msg:"success"
        }
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: String(error),
      };
    }
  }
  /**
   * 修改流程表单
   */
  async edit(ctx: AppRouterContext, next: Next) {
    const id = ctx.params['id']
    const body = ctx.request.body;
    try {
        await prisma.sysForm.update({
            where:{
                formId:Number(id)
            },
            data:{
                formName:body.formName,
                formContent:body.formContent,
                category:body.category,
                remark:body.remark
            }
        })
        ctx.body={
            code:200,
            msg:"success"
        }
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: String(error),
      };
    }
  }
  /**
   * 删除流程表单
   */
  async remove(ctx: AppRouterContext, next: Next) {
    const id = ctx.params['id']
    try{
        await prisma.sysForm.delete({
            where:{
                formId:Number(id)
            }
        })
        ctx.body = {
            code: 200,
            msg: "success",
          };
    }catch(error){
        ctx.body={
            code:500,
            msg:String(error)
        }
    }

  }
}
