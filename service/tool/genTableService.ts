import path from "node:path";
import { Prisma, type GenTable } from "@prisma/client";
import log4js from "../../utils/log4js";
import prisma from "../../utils/prisma";
import { TableEntity } from "../../common/entity/tableEntity";
export class GenTableService {
  async selectGentableById(id: number): Promise<GenTable | void> {
    try {
      const genTable = await prisma.genTable.findUnique({
        where: {
          tableId: id,
        },
      });
      if (genTable) {
        return genTable;
      } else {
        throw `no genTable with id ${id}`;
      }
    } catch (error) {
      log4js.error(error);
    }
  }
  selectGenTableList(genTable: GenTable) {}
  selectDbTableList(genTable: GenTable) {}
  async selectDbTableListByNames(tableNames: string[]) {
    const tableList:TableEntity[] = await prisma.$queryRaw`
    select table_name, table_comment, create_time, update_time from information_schema.tables
	where table_name NOT LIKE 'qrtz_%' and table_name NOT LIKE 'gen_%' and table_schema = (select database())
	and table_name in (${Prisma.join(tableNames)});
    `;
    return tableList
  }
  async selectGenTableAll(): Promise<GenTable[]> {
    const genTableList = await prisma.genTable.findMany({
      include: {
        genTabColumns: {
          orderBy: {
            sort: "asc",
          },
        },
      },
    });
    return genTableList;
  }
  updateGenTable() {}
  deleteGenTableByIds() {}
  async createTable(sql: string) {
    try {
      await prisma.$queryRaw`${sql}`;
    } catch (error) {
      log4js.error(error);
    }
  }
  async importGenTable(tableList: TableEntity[], userName: string) {
    for (const key in tableList) {
        const table=tableList[key]
        const tableName = table.table_name
        const tableComment = table.table_comment
        const row:Partial<GenTable> ={
            tableName:tableName,
            tableComment:tableComment,
            className:tableName,
            packageName:"",
            businessName:"",
            functionName:"",
            functionAuthor:"",
            createBy:userName
        }
        await prisma.genTable.create({
            data:row
        })
    }
  }
  async previewCode(tableId: number) {
    const dataMap = new Map<string, string>();
    const table = await prisma.genTable.findUnique({
      where: {
        tableId: tableId,
      },
    });
    if (table) {
    }
  }
  async generatorCode(tableName: string, zip: any) {
    const genTable = await prisma.genTable.findFirst({
      where: {
        tableName: tableName,
      },
    });
    if (genTable) {
    } else {
      throw `no genTable width tableName ${tableName}`;
    }
  }
  synchDb() {}
  downloadCode(tableNames: string): void;
  downloadCode(tableNames: string[]): void;
  downloadCode(tableNames: string | string[]) {}

  setSubTable(table: GenTable) {
    const subTableName = table.subTableName;
    if (subTableName !== "") {
    }
  }
  /**
   * 设置代码生成其他选项值
   * @param genTable
   */
  setTableFromOptions(genTable: any) {
    try {
      const paramsObj = JSON.parse(genTable.getOptions());
    } catch {}
  }
  /**
   * 获取代码生成地址
   */
  static getGenPath(table: any, template: string) {
    const genPath: string = table.getGenPath();
    if (genPath === "/") {
      // TODO
      return process.cwd();
    }
    return process.cwd();
  }
}
