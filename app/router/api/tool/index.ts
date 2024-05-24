import type { DefaultState, Context } from "koa";
import Router from "koa-router";
import GenTableController from "app/controller/genTableController";

const router = new Router<DefaultState, Context>({
    prefix:"/tool"
});


const genTablecontroller = new GenTableController()
router.get("/gen", genTablecontroller.list);
router.get("/gen/db", genTablecontroller.db);
router.get("/gen/column/:tableId", genTablecontroller.column);
router.post("/gen/import-table",genTablecontroller.importTable);
router.post("/gen/create/table",genTablecontroller.createTable);
router.get("/gen/preview/:tableId", genTablecontroller.previewTable);
router.get("/gen/download/:tableName", genTablecontroller.downloadTable);
router.get("/gen/gen-code/:tableName", genTablecontroller.genCode);
router.get("/gen/sync-db/:tableName", genTablecontroller.syncDb);
router.get("/gen/batch-gen-code", genTablecontroller.batchGenCode);
router.get("/gen/:tableId", genTablecontroller.selectTable);
router.put("/gen/:tableId", genTablecontroller.editTable);
router.delete("/gen/:tableId", genTablecontroller.deleteTable);

export { router as toolRouter}