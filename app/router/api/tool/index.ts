import type { DefaultState, Context } from "koa";
import Router from "koa-router";
import GenTableController from "app/controller/genTableController";

const router = new Router<DefaultState, Context>({
    prefix:"/tool"
});


const genTablecontroller = new GenTableController()
router.get("/", genTablecontroller.list);
router.get("/db", genTablecontroller.db);
router.get("/column/:tableId", genTablecontroller.column);
router.post("/import-table",genTablecontroller.importTable);
router.post("/create/table",genTablecontroller.createTable);
router.get("/preview/:tableId", genTablecontroller.previewTable);
router.get("/download/:tableName", genTablecontroller.downloadTable);
router.get("/gen-code/:tableName", genTablecontroller.genCode);
router.get("/sync-db/:tableName", genTablecontroller.syncDb);
router.get("/batch-gen-code", genTablecontroller.batchGenCode);
router.get("/:tableId", genTablecontroller.selectTable);
router.put("/:tableId", genTablecontroller.editTable);
router.delete("/:tableId", genTablecontroller.deleteTable);

export { router as toolRouter}