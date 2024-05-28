import FlowDefinitionController from "app/controller/flowable/flowDefinitionController";
import FlowExpressionController from "app/controller/flowable/flowExpressionController";
import FlowFormController from "app/controller/flowable/flowFormController";
import FlowListenerController from "app/controller/flowable/flowListenerController";
import FlowTaskController from "app/controller/flowable/flowTaskController";
import type { DefaultState, Context } from "koa";
import Router from "koa-router";

const router = new Router<DefaultState, Context>({prefix:"/flowable"});
const flowDefinitionController = new FlowDefinitionController()
const flowFormController = new FlowFormController()
const flowExpressionController = new FlowExpressionController()
const flowListenerController = new FlowListenerController()
const flowTaskController = new FlowTaskController()

router.get("/definition",flowDefinitionController.list)
router.post("/definition",flowDefinitionController.add)
router.put("/definition",flowDefinitionController.edit)
router.delete("/definition/:id",flowDefinitionController.remove)
router.get("/form",flowFormController.list)
router.post("/form",flowFormController.add)
router.put("/form/:id",flowFormController.edit)
router.post("/form/add-deploy-form",flowFormController.deploy)
router.delete("/form/:id",flowFormController.remove)
router.get("/expression",flowExpressionController.list)
router.post("/expression",flowExpressionController.add)
router.put("/expression/:id",flowExpressionController.edit)
router.delete("/expression/:id",flowExpressionController.remove)
router.get("/listener",flowListenerController.list)
router.post("/listener",flowListenerController.add)
router.put("/listener/:id",flowListenerController.edit)
router.delete("/listener/:id",flowListenerController.remove)
router.get("/task/my-process",flowTaskController.myProcessList)
router.get("/task/todo",flowTaskController.todoList)
router.get("/task/finished",flowTaskController.finishedList)

export {
    router as flowableRouter
}
