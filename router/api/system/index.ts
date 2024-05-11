import type { DefaultState, Context } from "koa";
import Router from "koa-router";
import prisma from "../../../utils/prisma";
import { userRouter } from "./user";
import { roleRouter } from "./role";
import { menuRouter } from "./menu";
import { deptRouter } from "./dept";
import { noticeRouter } from "./notice";
import { dictRouter } from "./dict";
import { configRouter } from "./config";

const systemRouter = new Router<DefaultState, Context>({ prefix: "/system" });

systemRouter.use(userRouter.routes(),userRouter.allowedMethods())
systemRouter.use(roleRouter.routes(),roleRouter.allowedMethods())
systemRouter.use(menuRouter.routes(),menuRouter.allowedMethods())
systemRouter.use(deptRouter.routes(),deptRouter.allowedMethods())
systemRouter.use(noticeRouter.routes(),noticeRouter.allowedMethods())
systemRouter.use(dictRouter.routes(),dictRouter.allowedMethods())
systemRouter.use(configRouter.routes(),configRouter.allowedMethods())

/** 系统管理-用户管理-获取所有角色列表 */
systemRouter.get("/list-all-role", async (ctx, next) => {
  const roles = await prisma.sysRole.findMany({
    select: {
      roleId: true,
      roleName: true,
    },
  });

  ctx.body = {
    success: true,
    msg: "ok",
    data: roles.map((item) => ({ id: item.roleId, name: item.roleName })),
  };

});
/** 系统管理-用户管理-根据userId，获取对应角色id列表（userId：用户id） */
systemRouter.post("/list-role-ids", async (ctx, next) => {
  const body = ctx.request.body as any;
  if (body.userId) {
    if (body.userId == 1) {
      ctx.body = {
        code:200,
        msg:"success",
        data: [1],
      };
    } else if (body.userId == 2) {
      return {
        success: true,
        data: [2],
      };
    }
  } else {
    ctx.body = {
      code:200,
      msg:"success",
      data: [],
    };
  }
});



/** 获取角色管理-权限-菜单权限 */
systemRouter.get("/role-menu", async (ctx, next) => {
  let menus = await prisma.sysMenu.findMany({
    select: {
      parentId: true,
      menuId: true,
      title: true,
      menuType: true
    }
  })
  const data = menus.map(item => ({
    parentId: item.parentId,
    menuType: item.menuType,
    title: item.title,
    id: item.menuId,
  }))
  ctx.body = {
    code:200,
    msg:"success",
    data: data
  }
});

/** 获取角色管理-权限-菜单权限-根据角色 id 查对应菜单 */
systemRouter.post("/role-menu-ids", async (ctx, next) => {
  const body = ctx.request.body as any;
  const menus = await prisma.sysRoleMenu.findMany({
    where: {
      roleId: Number(body.id)
    },
    select: {
      menuId: true
    }
  })
  ctx.body = {
    code:200,
    msg:"success",
    data: menus.map(item => item.menuId)
  }
});
export { systemRouter };
