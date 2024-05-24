import FlowableController from "app/controller/flowableController";
import type { DefaultState, Context } from "koa";
import Router from "koa-router";

const router = new Router<DefaultState, Context>({prefix:"/flowable"});
const flowableController = new FlowableController()

router.get("/task/definition",flowableController.definition)
router.get("/task/form",flowableController.form)
router.get("/task/my-process",flowableController.myProcessList)
router.get("/task/expression",flowableController.expression)
router.get("/task/listener",flowableController.listener)
router.get("/task/todo",flowableController.todoList)
router.get("/task/finished",flowableController.finishedList)

export {
    router as flowableRouter
}
