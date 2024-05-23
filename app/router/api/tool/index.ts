import type { DefaultState, Context } from "koa";
import Router from "koa-router";
import { genRouter } from "./gen";

const toolRouter = new Router<DefaultState, Context>({
    prefix:"/tool"
});
toolRouter.use(genRouter.routes(),genRouter.allowedMethods())

export {toolRouter}