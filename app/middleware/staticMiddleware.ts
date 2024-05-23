import path from "node:path"
import assert from "node:assert"
import send from "koa-send"
import type { Context, Next } from "koa"

type Opts={
    root?:string
    index?:string
    defer?:boolean
}
export default function(root:string,opts:Opts={}){
    assert(root,'root directory is required to serve files')
    opts.root=path.resolve(root)
    opts.index=opts.index ?? 'index.html'

    if(!opts.defer){
        return async function(ctx:Context,next:Next){
            let done:boolean|string = false

            if(ctx.method === 'HEAD' || ctx.method === 'GET'){
                try{
                    done = await send(ctx,ctx.path,opts)
                }catch(err:any){
                    
                    if(err.status !== 404){
                        throw err
                    }
                }
            }
            if(!done){
                await next()
            }
        }
    }

    return async function(ctx:Context,next:Next){
        await next()
        if (ctx.method !== 'HEAD' && ctx.method !== 'GET') return
        // response is already handled
        if (ctx.body != null || ctx.status !== 404) return // eslint-disable-line

        try {
            await send(ctx, ctx.path, opts)
        } catch (err:any) {
            if (err.status !== 404) {
                throw err
            }
        }
  }
    
}