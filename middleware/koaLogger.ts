import { Context, Next } from "koa";
import * as log4js from "../utils/log4js.js"

export default function(){
    return async function(ctx:Context,next:Next){
        if(!ctx.log4js){
            ctx.log4js=log4js
        }
        const start=new Date().getTime();
        await next();
        const ms = new Date().getTime() - start;
        log4js.info(`==>${ctx.path} use ${ms}ms.`)
    }
}