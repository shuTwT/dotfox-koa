import type { Context, Next } from "koa";
import UAParser from "ua-parser-js";

/**
 * 演示模式 禁止所有非get请求
 * @returns 
 */
export default function(){
    return async function(ctx:Context,next:Next){
        if(process.env.DEMO_M0DE==='true'){
            if(ctx.method==='GET'){
                await next()
            }else{
                ctx.body={
                    code:403,
                    msg:"演示模式，禁止操作"
                }
            }
        }else{
            await next()
        }
        
    }
}