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
//task
//https://gitee.com/tony2y/RuoYi-flowable/blob/master/ruoyi-flowable/src/main/java/com/ruoyi/flowable/controller/FlowTaskController.java
router.get("/task/my-process",flowTaskController.myProcessList)
router.post("/task/stop-process",flowTaskController.stopProcess)
router.post("/task/revoke-process",flowTaskController.revokeProcess)
router.get("/task/todo",flowTaskController.todoList)
router.get("/task/finished",flowTaskController.finishedList)
router.get("/task/flow-record",flowTaskController.flowRecord)
router.get("/task/flow-form-data",flowTaskController.flowFormData)
router.get("/task/process-variables/:taskId",flowTaskController.processVariables)
router.post("/task/complete",flowTaskController.complete)
router.post("/task/reject",flowTaskController.reject)
router.post("/task/return",flowTaskController.taskReturn)
router.post("/task/return-list",flowTaskController.findReturnTskList)
router.delete("/task/delete",flowTaskController.delete)
router.post("/task/claim",flowTaskController.claim)
router.post("/task/un-claim",flowTaskController.unClaim)
router.post("/task/delegate-task",flowTaskController.delegateTask)
router.post("/task/resolve-task",flowTaskController.resolveTask)
router.post("/task/assign-task",flowTaskController.assignTask)
router.post("/task/add-multi-instance-execution",flowTaskController.addMultiInstanceExecution)
router.post("/task/delete-multi-instance-execution",flowTaskController.deleteMultiInstanceExecution)
router.post("/task/next-flow-node",flowTaskController.getNextFlowNode)
router.post("/task/next-flow-node-start",flowTaskController.getNextFlowNodeByStart)
router.get("/task/diagram/:processId",flowTaskController.genProcessDiagram)
router.get("/task/flow-viewer/:procInsId/:executionId",flowTaskController.getFlowViewer)
router.get("/task/flow-xml-and-node",flowTaskController.flowXmlAndNode)
router.get("/task/flow-task-form",flowTaskController.flowTaskForm)

export {
    router as flowableRouter
}
