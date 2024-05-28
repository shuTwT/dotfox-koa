import ExpressionController from "app/controller/flowable/expressionController";
import ListenerController from "app/controller/flowable/listenerController";
import FlowableController from "app/controller/flowableController";
import type { DefaultState, Context } from "koa";
import Router from "koa-router";

const router = new Router<DefaultState, Context>({prefix:"/flowable"});
const flowableController = new FlowableController()
const expressionController = new ExpressionController()
const listenerController = new ListenerController()

router.get("/definition",flowableController.definitionList)
router.post("/definition",flowableController.createDefinition)
router.put("/definition",flowableController.updateDefinition)
router.delete("/definition/:id",flowableController.deleteDefinition)
router.get("/form",flowableController.formList)
router.post("/form",flowableController.createForm)
router.put("/form/:id",flowableController.updateForm)
router.post("/form/add-deploy-form",flowableController.addDeployForm)
router.delete("/form/:id",flowableController.deleteForm)
router.get("/expression",expressionController.list)
router.post("/expression",expressionController.add)
router.put("/expression/:id",expressionController.edit)
router.delete("/expression/:id",expressionController.remove)
router.get("/listener",listenerController.list)
router.post("/listener",listenerController.add)
router.put("/listener/:id",listenerController.edit)
router.delete("/listener/:id",listenerController.remove)
router.get("/task/my-process",flowableController.myProcessList)
router.get("/task/todo",flowableController.todoList)
router.get("/task/finished",flowableController.finishedList)

export {
    router as flowableRouter
}
