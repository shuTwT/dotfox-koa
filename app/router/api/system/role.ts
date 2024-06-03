import type { DefaultState, Context } from "koa";
import Router from "koa-router";
import prisma from "../../../utils/prisma";
import { parseQuery, str2num } from "../../../utils/utils";
import dayjs from "dayjs";

const roleRouter = new Router<DefaultState, Context>({ prefix: "/role" });

/** 获取系统管理-角色管理列表 */
roleRouter.get("/", async (ctx, next) => {
    
  });

export {roleRouter}