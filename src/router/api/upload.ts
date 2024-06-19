import type { DefaultState, Context } from "koa";
import Router from "koa-router";
import path from 'node:path';
import fs from 'node:fs'

const uploadDir = path.resolve(process.cwd(),'public','upload')

const uploadRouter = new Router<DefaultState, Context>();
uploadRouter.post('/upload',async(ctx,next)=>{
    const files = ctx.request.files
    console.log(files)
    if(ctx.request.files){
        const {file} = ctx.request.files
        if(file){
            if(!Array.isArray(file)){
                ctx.body={
                    code:200,
                    msg:"上传成功",
                    data:{
                        filepath:file.filepath,
                        filename:file.newFilename,
                        originalfilename:file.originalFilename,
                        url:'/upload/'+file.newFilename
                    }
                }
            }
        }
    }else{
        ctx.body={
            code:500,
            msg:'上传失败'
        }
    }
    
    
})

export {uploadRouter}