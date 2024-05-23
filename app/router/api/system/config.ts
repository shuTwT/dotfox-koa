import type { DefaultState, Context } from "koa";
import Router from "koa-router";
import prisma from "../../../utils/prisma";
import { parseQuery, str2num } from "../utils";
import dayjs from "dayjs";

const configRouter = new Router<DefaultState, Context>({ prefix: "/config" });

/**
 * @description 获取配置参数列表
 */
configRouter.get("/",async (ctx,next)=>{
    const query = ctx.query as any;
    const configName = parseQuery(query,'configName')
    const configKey = parseQuery(query,'configKey')
    const configType = parseQuery(query,'configType')
    const pageSize = str2num(parseQuery(query, "pageSize"), 10);
    const pageNum = str2num(parseQuery(query, "pageNum"), 1);
    try{
        const [list,count] = await prisma.$transaction([ prisma.sysConfig.findMany({
            where:{
                configName:{
                    contains:configName
                },
                configKey:{
                    contains:configKey
                },
                configType:{
                    contains:configType
                }
            },
            skip: (pageNum - 1) * pageSize,
            take: pageSize,
        }),prisma.sysConfig.count({
            where:{
                configName:{
                    contains:configName
                },
                configKey:{
                    contains:configKey
                },
                configType:{
                    contains:configType
                }
            },
        })])
        ctx.body={
            code:200,
            msg:"success",
            data:{
                list,
                total:count
            }
        }
    }catch(error){
        ctx.body={
            code:500,
            msg:String(error)
        }
    }
})

/**
 * 根据id查询
 */
configRouter.get("/:configId",async(ctx,next)=>{
    const params = ctx.params
    const configId = Number(params['configId'])
    try{
        const config = await prisma.sysConfig.findUnique({
            where:{
                configId
            }
        })
        ctx.body={
            code:200,
            msg:"success",
            data:config
        }
    }catch(error){
        ctx.body={
            code:500,
            msg:String(error)
        }
    }
})

configRouter.get("/config-key/:configKey",async(ctx,next)=>{
    const params = ctx.params
    const configKey = params['configKey']
    try{
        const config = await prisma.sysConfig.findFirst({
            where:{
                configKey
            }
        })
        ctx.body={
            code:200,
            msg:"success",
            data:config
        }
    }catch(error){
        ctx.body={
            code:500,
            msg:String(error)
        }
    }
})

/**
 * 新增配置参数
 */
configRouter.post("/",async(ctx,next)=>{
    const body= ctx.request.body as any
    const loginUser = ctx.getLoginUser();
    const date = dayjs();
    try{
        const config = await prisma.sysConfig.create({
            data:{
                configKey:body.configKey,
                configName:body.configName,
                configType:body.configType,
                configValue:body.configValue,
                createBy:loginUser.getUserName(),
                remark:body.remark
            }
        })
        ctx.body={
            code:200,
            msg:"success",
        }
    }catch(error){
        ctx.body={
            code:500,
            msg:String(error)
        }
    }
})

/**
 * 修改配置参数
 */
configRouter.put("/:configId",async(ctx,next)=>{
    const params = ctx.params
    const configId = Number(params['configId'])
    const body= ctx.request.body as any
    const loginUser = ctx.getLoginUser();
    const date = dayjs();
    try{
        const config = await prisma.sysConfig.update({
            where:{
                configId
            },
            data:{
                configKey:body.configKey,
                configName:body.configName,
                configType:body.configType,
                configValue:body.configValue,
                updateBy: loginUser.getUserName(),
                remark:body.remark
            }
        })
        ctx.body={
            code:200,
            msg:"success",
        }
    }catch(error){
        ctx.body={
            code:500,
            msg:String(error)
        }
    }
})

/**
 * 删除配置参数
 */
configRouter.delete("/:configId",async(ctx,next)=>{
    const params = ctx.params
    const configId = Number(params['configId'])
    try{
        const config = await prisma.sysConfig.delete({
            where:{
                configId
            },
        })
        ctx.body={
            code:200,
            msg:"success",
        }
    }catch(error){
        ctx.body={
            code:500,
            msg:String(error)
        }
    }
})

configRouter.post("/refresh-cache",async(ctx,next)=>{
    ctx.body={
        code:200,
        msg:"success"
    }
})

export {configRouter}