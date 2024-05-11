import type { DefaultState, Context } from "koa";
import Router from "koa-router";
import prisma from "../../../utils/prisma";
import { parseQuery, str2num } from "../utils";
import dayjs from "dayjs";

const menuRouter = new Router<DefaultState, Context>({ prefix: "/menu" });

/** 获取系统管理-菜单管理列表 */
menuRouter.get("/", async (ctx, next) => {
  let menus = await prisma.sysMenu.findMany();
  menus = menus.map((item) => ({
    ...item,
    id: item.menuId,
  }));
  ctx.body = {
    code: 200,
    msg: "success",
    data: menus,
  };
});

menuRouter.get("/tree-select",async(ctx,next)=>{
    let menus = await prisma.sysMenu.findMany();
    menus = menus.map((item) => ({
        ...item,
      label:item.title,
      value:item.menuId
    }));
    ctx.body = {
      code: 200,
      msg: "success",
      data: menus,
    };
})

/** 新增菜单 */
menuRouter.post("/", async (ctx, next) => {
  const body = ctx.request.body as any;
  try {
    await prisma.sysMenu.create({
      data: {
        activePath: body.activePath,
        auths: body.auths,
        component: body.component,
        enterTransition: body.enterTransition,
        extraIcon: body.extraIcon,
        frameLoading: body.frameLoading,
        frameSrc: body.frameSrc,
        hiddenTag: body.hiddenTag,
        icon: body.icon,
        keepAlive: body.keepAlive,
        leaveTransition: body.leaveTransition,
        menuType: body.menuType,
        menuName: body.menuName,
        parentId: body.parentId,
        path: body.path,
        rank: body.rank,
        redirect: body.redirect,
        showLink: body.showLink,
        showParent: body.showParent,
        title: body.title,
      },
    });
    ctx.body = {
      code: 200,
      msg: "新增成功",
    };
  } catch (error) {
    ctx.body = {
      code: 500,
      msg: "新增失败",
    };
  }
});

/** 更新菜单 */
menuRouter.put("/:menuId", async (ctx, next) => {
  const menuId = ctx.params["menuId"];
  const body = ctx.request.body as any;
  try {
    await prisma.sysMenu.update({
      where: {
        menuId: Number(menuId),
      },
      data: {
        activePath: body.activePath,
        auths: body.auths,
        component: body.component,
        enterTransition: body.enterTransition,
        extraIcon: body.extraIcon,
        frameLoading: body.frameLoading,
        frameSrc: body.frameSrc,
        hiddenTag: body.hiddenTag,
        icon: body.icon,
        keepAlive: body.keepAlive,
        leaveTransition: body.leaveTransition,
        menuType: body.menuType,
        menuName: body.menuName,
        parentId: body.parentId,
        path: body.path,
        rank: body.rank,
        redirect: body.redirect,
        showLink: body.showLink,
        showParent: body.showParent,
        title: body.title,
      },
    });
    ctx.body = {
      code: 200,
      msg: "修改成功",
    };
  } catch (error) {
    ctx.body = {
      code: 500,
      msg: error,
    };
  }
});

/** 递归删除子菜单 */
async function deleteMenuChildren(pid: number) {
  const menus = await prisma.sysMenu.findMany({
    where: {
      parentId: pid,
    },
  });
  if (menus.length > 0) {
    menus.forEach((item) => {
      deleteMenuChildren(item.menuId);
    });
  }
  await prisma.sysMenu.deleteMany({
    where: {
      menuId: pid,
    },
  });
}

/** 删除菜单 */
menuRouter.delete("/:menuId", async (ctx, next) => {
  const menuId = ctx.params["menuId"];
  try {
    await prisma.sysMenu.delete({
      where: {
        menuId: Number(menuId),
      },
    });
    await deleteMenuChildren(Number(menuId));
    ctx.body = {
      code: 200,
      msg: "删除" + menuId,
    };
  } catch (error) {
    ctx.body = {
      code: 500,
      msg: "删除失败",
    };
  }
});

export { menuRouter };
