import type Koa from "koa";
import Router from "koa-router";

const apiRouter = new Router<Koa.DefaultState, Koa.Context>({ prefix: "/api/goview/sys" });

apiRouter.post("/login",async ()=>{

})

apiRouter.get("/logout",async ()=>{

})

apiRouter.get("/getOssInfo",async(ctx)=>{
    ctx.body={
        code:200,
        data:{
            bucketURL: "https://admin.mtruning.club/static/file_upload/"
        },
        msg:"返回成功"
    }
})