/**
 * 参考
 * https://github.com/simon300000/bilibili-live-ws
 * https://github.com/lovelyyoshino/Bilibili-Live-API/blob/master/API.WebSocket.md
 * https://github.com/Minteea/floating-live
 * https://github.com/SocialSisterYi/bilibili-API-collect
 */
import 'reflect-metadata'
import './env'
import Koa from "koa";
import * as dotenv from "dotenv";
import path from 'node:path';
import koaStatic from "./app/middleware/staticMiddleware.js";
import koaLogger from "./app/middleware/koaLogger.js";
import { createServer } from "node:http";
import { createRoutes } from "./app/router/routes.js";
import * as log4js from "./app/utils/log4js.js"
import jwtMiddleware from "./app/middleware/jwtMiddleware.js";
import uaMiddleware from "./app/middleware/uaMiddleware.js";
import {koaBody} from 'koa-body'
import demoMidleware from "./app/middleware/demoMidleware.js";

dotenv.config({
    path:".env"
});

dotenv.config({
    path:".env.local"
});

if(process.env.NODE_ENV){
    dotenv.config({
        path:`.env.${process.env.NODE_ENV}`
    });
    dotenv.config({
        path:`.env.${process.env.NODE_ENV}.local`
    });
}

const port = Number.parseInt(process.env.APP_PORT ||'3000');

const app = new Koa<Koa.DefaultState,Koa.Context>();

app.keys = ["signedKey"];
app.use((ctx,next)=>{
  if(ctx.path==='/api/upload') ctx.disableBodyParser = true
  return next()
})
app.use(koaBody({
  multipart:true,
  formidable:{
    keepExtensions:true,
    maxFieldsSize: 2 * 1024 * 1024,
    uploadDir:path.resolve(process.cwd(),'public','upload')
  }
}))
app.use(koaLogger());
app.use(uaMiddleware())
app.use(jwtMiddleware([
    "/",
    "/api/login",
    "/api/swagger",
    "/api/system/notice/msg"
  ])
)
// app.use(koaStatic(path.resolve(process.cwd(), "static")));
app.use(koaStatic(path.resolve(process.cwd(), "public")));
app.use(demoMidleware())
createRoutes(app)

const HTTPServer = createServer(app.callback());

HTTPServer.listen(port,'0.0.0.0', () =>{
  log4js.info(`NODE_ENV ${process.env.NODE_ENV}`)
  log4js.info(`started server on http://localhost:${port}`)
});
