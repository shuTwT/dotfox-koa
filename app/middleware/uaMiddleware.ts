import type { Context, Next } from "koa";
import UAParser from "ua-parser-js";

/**
 * 解析user-agent
 * @returns 
 */
export default function(){
    return async function(ctx:Context,next:Next){
        const userAgent = ctx.req.headers['user-agent']
        const uaParser = new UAParser(userAgent)
        if (!ctx.ua){
            ctx.ua = uaParser;
        } 
        await next()
    }
}