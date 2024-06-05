import GoviewProjectController from "app/controller/goview/goviewProjectController";
import GoviewSysController from "app/controller/goview/goviewSysController";
import type Koa from "koa";
import Router from "koa-router";

const router = new Router<Koa.DefaultState, Koa.Context>({ prefix: "/goview" });
const goviewProjectController = new GoviewProjectController()
const goviewSysController = new GoviewSysController()
// project
router.get("/project/list", goviewProjectController.list)
router.post("/project/create", goviewProjectController.create)
router.delete("/project/delete", goviewProjectController.remove)
router.put("/project/edit", goviewProjectController.edit)
router.post("/project/rename", goviewProjectController.rename)
router.put("/project/publish", goviewProjectController.publish)
router.get("/project/getData", goviewProjectController.getData)
router.post("/project/save/data", goviewProjectController.saveData)
router.post("/project/upload", goviewProjectController.upload)

//sys
router.post("/sys/login",goviewSysController.login)
router.get("/sys/getOssInfo",goviewSysController.getOssInfo)
export{ router as goviewRouter}