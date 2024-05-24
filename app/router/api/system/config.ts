import type { DefaultState, Context } from "koa";
import Router from "koa-router";
import { ConfigController } from "app/controller/system/configController";

const configRouter = new Router<DefaultState, Context>({ prefix: "/config" });

const configController = new ConfigController()

configRouter.get("/",configController.list)
configRouter.get("/:configId",configController.selectConfigById)
configRouter.get("/config-key/:configKey",configController.selectConfigByKey)
configRouter.post("/",configController.createConfig)
configRouter.put("/:configId",configController.editConfig)
configRouter.delete("/:configId",configController.deteleConfig)
configRouter.post("/refresh-cache",configController.refreshCache)

export {configRouter}