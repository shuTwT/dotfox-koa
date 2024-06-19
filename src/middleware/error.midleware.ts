import type { Context, Next } from "koa";

/**
 * 演示模式 禁止所有非get请求
 * @returns 
 */
export default function(){
    return async function(ctx:Context,next:Next){
        try{
            await next()
        }catch(error){
            ctx.log4js.error(error)
            ctx.body={
                code:500,
                msg:String(error)
            }
        }
        
    }
}