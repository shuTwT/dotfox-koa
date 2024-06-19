import { BaseController } from "src/common/base/baseController";
import prisma from "src/utils/prisma";
import { parseQuery, str2num } from "src/utils/utils";
import { GenTableService } from "src/service/tool/genTable.service";
const genTableService = new GenTableService();
export default class GenTableController extends BaseController {
  /**
   * 查询代码生成列表
   */
  async list(ctx: AppRouterContext, next: Next) {
    const pageSize = str2num(parseQuery(ctx.query, "pageSize"), 10);
    const pageNum = str2num(parseQuery(ctx.query, "pageNum"), 1);
    const [list, count] = await prisma.$transaction([
      prisma.genTable.findMany({
        skip: (pageNum - 1) * pageSize,
        take: pageSize,
      }),
      prisma.genTable.count(),
    ]);
    ctx.body = {
      code: 200,
      msg: "success",
      data: {
        list,
        total: count,
        pageSize,
        pageNum,
      },
    };
  }
  /**
   * 查询数据库列表
   */
  async db(ctx: AppRouterContext, next: Next) {
    const tableName = parseQuery(ctx.query, "tableName") ?? "";
    const tableComment = parseQuery(ctx.query, "tableComment") ?? "";
    const pageSize = str2num(parseQuery(ctx.query, "pageSize"), 10);
    const pageNum = str2num(parseQuery(ctx.query, "pageNum"), 1);
    const skip = (pageNum - 1) * pageSize;
    try {
      const [dbTables, count]: any[] = await prisma.$transaction([
        prisma.$queryRaw`
          SELECT table_name,table_comment,create_time,update_time FROM information_schema.tables
          WHERE table_schema = (select database())
          AND table_name NOT LIKE 'qrtz_%' AND table_name NOT LIKE 'gen_%' AND table_name NOT LIKE '_prisma_%'
          AND table_name NOT IN (select table_name from gen_table)
          AND table_name LIKE CONCAT('%',${tableName},'%')
          AND table_comment LIKE CONCAT('%',${tableComment},'%')
          ORDER BY update_time desc
          LIMIT ${skip},${pageSize};
          `,
        prisma.$queryRaw`
          SELECT COUNT(*) as counts FROM information_schema.tables
          WHERE table_schema = (select database())
          AND table_name NOT LIKE 'qrtz_%' AND table_name NOT LIKE 'gen_%' AND table_name NOT LIKE '_prisma_%'
          AND table_name NOT IN (select table_name from gen_table)
          AND table_name LIKE CONCAT('%',${tableName},'%')
          AND table_comment LIKE CONCAT('%',${tableComment},'%')
          GROUP BY table_schema
          `,
      ]);
      ctx.body = {
        code: 200,
        msg: "success",
        data: {
          list: dbTables,
          total: Number(count[0].counts),
          pageSize,
          pageNum,
        },
      };
    } catch (error) {
      ctx.log4js.error(error);
      ctx.body = {
        code: 500,
        msg: String(error),
      };
    }
  }
  /**
   * 查询数据表字段列表
   */
  async column(ctx: AppRouterContext, next: Next) {}
  /**
   * 导入表结构
   */
  async importTable(ctx: AppRouterContext, next: Next) {
    const body = ctx.request.body;
    const loginUser = ctx.getLoginUser();
    const tableNames: string = body.tableNames;
    const tableList = await genTableService.selectDbTableListByNames(
      tableNames.split(",")
    );
    await genTableService.importGenTable(tableList, loginUser.getUserName());
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }

  /**
   * 创建表结构
   */
  async createTable(ctx: AppRouterContext, next: Next) {
    const body = ctx.request.body;
    const sql: string = body.sql;

    const tableNames: string[] = [];
  }
  /**
   * 预览代码
   */
  async previewTable(ctx: AppRouterContext, next: Next) {}
  /**
   * 生成代码(下载)
   */
  async downloadTable(ctx: AppRouterContext, next: Next) {}
  /**
   * 生成代码(自定义路径)
   */
  async genCode(ctx: AppRouterContext, next: Next) {}
  /**
   * 同步数据库
   */
  async syncDb(ctx: AppRouterContext, next: Next) {}
  /**
   * 批量生成代码
   */
  async batchGenCode(ctx: AppRouterContext, next: Next) {}
  /**
   * 修改代码生成业务
   */
  async selectTable(ctx: AppRouterContext, next: Next) {
    const tableId = Number(ctx.params["tableId"]);
    try {
      const table = await prisma.genTable.findUnique({
        where: {
          tableId,
        },
        include: {
          genTabColumns: true,
        },
      });
      ctx.body = {
        code: 200,
        msg: "success",
        data: table,
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        msg: String(error),
      };
    }
  }
  /**
   * 修改保存代码生成业务
   */
  async editTable(ctx: AppRouterContext, next: Next) {
    const tableId = Number(ctx.params["tableId"]);
    const body = ctx.request.body;
    try {
      await prisma.genTable.update({
        where: {
          tableId: tableId,
        },
        data: {
          businessName: body.businessName,
          className: body.className,
          functionAuthor: body.functionAuthor,
          functionName: body.functionName,
          genPath: body.genPath,
          genType: body.genType,
          moduleName: body.moduleName,
          packageName: body.packageName,
          remark: body.remark,
        },
      });
      if (body.columns && Array.isArray(body.columns)) {
        for (const key in body.columns) {
          const column = body.columns[key];
          await prisma.genTableColumn.update({
            where: {
              columnId: column.columnId,
              tableId: tableId,
            },
            data: {
              columnComent: column.columnComent,
              javaField: column.javaField,
              javaType: column.javaType,
              isInsert: column.isInsert,
              isEdit: column.isEdit,
              isList: column.isList,
              isQuery: column.isQuery,
              queryType: column.queryType,
              isRequired: column.isRequired,
              htmlType: column.htmlType,
              dictType: column.dictType,
            },
          });
        }
      }
      ctx.body = {
        code: 200,
        msg: "success",
      };
    } catch (error) {
      ctx.log4js.error(error);
      ctx.body = {
        code: 500,
        msg: String(error),
      };
    }
  }

  /**
   * 删除代码生成
   */
  async deleteTable(ctx: AppRouterContext, next: Next) {}
}
