import type Koa from "koa";
import Router from "koa-router";
import { authRouter } from "./auth.js";
import { systemRouter } from "./system/index.js";
import { asyncRoutesRouter } from "./asyncRoutes.js";
import { monitorRouter } from "./system/monitor.js";
import { uploadRouter } from "./upload.js";
import { toolRouter } from "./tool/index.js";

const apiRouter = new Router<Koa.DefaultState, Koa.Context>({ prefix: "/api" });

apiRouter.use(authRouter.routes(), authRouter.allowedMethods());
apiRouter.use(systemRouter.routes(), systemRouter.allowedMethods());
apiRouter.use(monitorRouter.routes(), monitorRouter.allowedMethods());
apiRouter.use(asyncRoutesRouter.routes(), asyncRoutesRouter.allowedMethods());
apiRouter.use(uploadRouter.routes(),uploadRouter.allowedMethods())
apiRouter.use(toolRouter.routes(),toolRouter.allowedMethods())

export { apiRouter };
