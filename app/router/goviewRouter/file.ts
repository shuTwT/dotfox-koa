import type Koa from "koa";
import Router from "koa-router";

const fileRouter = new Router<Koa.DefaultState, Koa.Context>({ prefix: "/api/file" });

fileRouter.delete("/remove",async()=>{

})

fileRouter.put("/update",async()=>{
    
})

fileRouter.post("/upload",async()=>{
    
})

fileRouter.post("/uploadbase64",async()=>{
    
})

fileRouter.post("/getFileText",async()=>{
    
})

fileRouter.post("/getFileText302",async()=>{
    
})

fileRouter.post("/coverupload",async()=>{
    
})

fileRouter.get("/getFileid/:id",async()=>{
    
})

fileRouter.get("/getFileid/302/:id",async()=>{
    
})

fileRouter.get("/list",async()=>{
    
})