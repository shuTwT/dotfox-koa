import FlowableController from "app/controller/flowableController";
import type { DefaultState, Context } from "koa";
import Router from "koa-router";

const router = new Router<DefaultState, Context>({prefix:"/flowable"});
const flowableController = new FlowableController()

router.get("/definition",flowableController.definitionList)
router.get("/definition/save",flowableController.createDefinition)
router.get("/form",flowableController.formList)
router.post("/form",flowableController.createForm)
router.post("/form/add-deploy-form",flowableController.addDeployForm)
router.get("/expression",flowableController.expressionList)
router.get("/listener",flowableController.listenerList)
router.post("/listener",flowableController.createListener)
router.get("/task/my-process",flowableController.myProcessList)
router.get("/task/todo",flowableController.todoList)
router.get("/task/finished",flowableController.finishedList)

export {
    router as flowableRouter
}
