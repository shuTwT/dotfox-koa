import type Koa from "koa";
import Router from "koa-router";
import { apiRouter } from "./api/api.js";

const router = new Router<Koa.DefaultState, Koa.Context>();

router.get("/", async (ctx, next) => {
  ctx.body = "项目已成功运行,请通过前端访问"
});

export const createRoutes = (app: Koa<Koa.DefaultState, Koa.Context>) => {
    router.use(apiRouter.routes(),apiRouter.allowedMethods())
  app
    .use(router.routes())
    .use(router.allowedMethods())
};
