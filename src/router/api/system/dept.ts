import type { DefaultState, Context } from "koa";
import Router from "koa-router";
import DeptController from "app/controller/system/deptController";

const deptRouter = new Router<DefaultState, Context>({ prefix: "/dept" });
const deptController = new DeptController()

//部门管理
deptRouter.get("/",deptController.list);
deptRouter.post("/",deptController.add);
deptRouter.put("/:deptId",deptController.edit);
deptRouter.delete("/:deptId",deptController.remove);

export { deptRouter };
