import type { DefaultState, Context } from "koa";
import Router from "koa-router";
import MenuController from "app/controller/system/menuController";

const menuRouter = new Router<DefaultState, Context>({ prefix: "/menu" });

const menuController = new MenuController()

//菜单管理
menuRouter.get("/",menuController.list);
menuRouter.get("/tree-select",menuController.treeSelect)
menuRouter.post("/", menuController.createMenu);
menuRouter.put("/:menuId", menuController.editMenu);
menuRouter.delete("/:menuId",menuController.deleteMenu);

export { menuRouter };
