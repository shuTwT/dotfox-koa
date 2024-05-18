import type Koa from "koa";
import Router from "koa-router";

const projectRouter = new Router<Koa.DefaultState, Koa.Context>({ prefix: "/api/goview/project" });

projectRouter.get("/list",async(ctx)=>{
    ctx.body={
        code:200,
        count:22046,
        data:[],
        msg:"获取成功"
    }
})

projectRouter.post("/create",async()=>{
    
})

projectRouter.delete("/delete",async()=>{
    
})

projectRouter.post("/edit",async()=>{
    
})

projectRouter.post("/rename",async()=>{
    
})

projectRouter.put("/publish",async()=>{
    
})

projectRouter.get("/getData",async()=>{

})

projectRouter.post("/save/data",async()=>{

})

projectRouter.post("/upload",async()=>{

})