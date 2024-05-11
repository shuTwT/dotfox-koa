import type Koa from "koa";
import Router from "koa-router";
import { str2num, parseQuery } from "./api/utils.js";
import { apiRouter } from "./api/api.js";
import { SwaggerRouter } from "koa-swagger-decorator";

const router = new Router<Koa.DefaultState, Koa.Context>();

router.get("/", async (ctx, next) => {
  ctx.body = "项目已成功运行,请通过前端访问"
});

const swaggerRouter = new SwaggerRouter<Koa.DefaultState, Koa.Context>({
  spec: {
    info: {
      title: "Example API Server",
      version: "v1.0",
    },
  },
  swaggerHtmlEndpoint: "/api/swagger/index.html",
  swaggerJsonEndpoint: "/api/swagger/api-docs",
});

swaggerRouter.swagger();

export const createRoutes = (app: Koa<Koa.DefaultState, Koa.Context>) => {
  app
    .use(router.routes())
    .use(swaggerRouter.routes())
    .use(swaggerRouter.allowedMethods())
    .use(apiRouter.routes())
    .use(apiRouter.allowedMethods())
   
      
};
