import type Koa from "koa";
import Router from "koa-router";
import { authRouter } from "./auth.js";
import { systemRouter } from "./system/index.js";
import { asyncRoutesRouter } from "./asyncRoutes.js";
import { monitorRouter } from "./monitor.js";
import { uploadRouter } from "./upload.js";
import { toolRouter } from "./tool/index.js";
import { flowableRouter } from "./flowable.js";
import { goviewRouter } from "./goview.js";

const apiRouter = new Router<Koa.DefaultState, Koa.Context>({ prefix: "/api" });

apiRouter.use(authRouter.routes(), authRouter.allowedMethods());
apiRouter.use(systemRouter.routes(), systemRouter.allowedMethods());
apiRouter.use(monitorRouter.routes(), monitorRouter.allowedMethods());
apiRouter.use(asyncRoutesRouter.routes(), asyncRoutesRouter.allowedMethods());
apiRouter.use(uploadRouter.routes(),uploadRouter.allowedMethods())
apiRouter.use(toolRouter.routes(),toolRouter.allowedMethods())
apiRouter.use(flowableRouter.routes(),flowableRouter.allowedMethods())
apiRouter.use(goviewRouter.routes(),goviewRouter.allowedMethods())

export { apiRouter };
