import type { DefaultState, Context } from "koa";
import Router from "koa-router";
import DictController from "app/controller/system/dictController";

const dictRouter = new Router<DefaultState, Context>({ prefix: "/dict" });
const dictController=new DictController()

//字典管理
dictRouter.get("/type", dictController.typeList);
dictRouter.get("/type/optionselect",dictController.typeOptionSelect)
dictRouter.get("/type/:dictId",dictController.selectType);
dictRouter.put("/type/:dictId", dictController.editType);
dictRouter.delete("/type/:dictIds", dictController.deleteType);
dictRouter.post("/type",dictController.createType);
dictRouter.get("/data", dictController.dataList);
dictRouter.post("/data", dictController.createData);
dictRouter.get("/data/:dictCode", dictController.selectData);
dictRouter.put("/data/:dictCode", dictController.editData);
dictRouter.delete("/data/:dictCodes", dictController.deleteData);

export { dictRouter };
