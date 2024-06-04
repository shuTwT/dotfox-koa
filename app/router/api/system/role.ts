import type { DefaultState, Context } from "koa";
import Router from "koa-router";
import RoleController from "app/controller/system/roleControlle";

const roleRouter = new Router<DefaultState, Context>({ prefix: "/role" });
const roleController = new RoleController()

/** 获取系统管理-角色管理列表 */
roleRouter.get("/",roleController.list);
roleRouter.post("/",roleController.add);
roleRouter.put("/:id",roleController.edit);
roleRouter.delete("/:id",roleController.remove);

export {roleRouter}