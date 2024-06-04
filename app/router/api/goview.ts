import GoviewProjectController from "app/controller/goview/goviewProjectController";
import type Koa from "koa";
import Router from "koa-router";

const router = new Router<Koa.DefaultState, Koa.Context>({ prefix: "/goview" });
const goviewProjectController = new GoviewProjectController()

// project
router.get("/project/list", goviewProjectController.list)
router.post("/project/create", goviewProjectController.add)
router.delete("/project/delete", goviewProjectController.remove)
router.put("/project/edit", goviewProjectController.edit)
router.post("/project/rename", goviewProjectController.rename)
router.get("/project/publish", goviewProjectController.publish)
router.get("/project/getData", goviewProjectController.getData)
router.get("/project/save/data", goviewProjectController.saveData)
router.get("/project/upload", goviewProjectController.upload)

export{ router as goviewRouter}