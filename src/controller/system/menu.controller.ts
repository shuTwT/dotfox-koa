import { BaseController } from "src/common/base/baseController";
import prisma from "src/utils/prisma";

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

export default class MenuController extends BaseController {
    /** 菜单管理列表 */
  async list(ctx: AppRouterContext, next: Next) {
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
  }
  /**
   * 树形菜单
   */
  async treeSelect(ctx: AppRouterContext, next: Next) {
    let menus = await prisma.sysMenu.findMany();
    menus = menus.map((item) => ({
      ...item,
      label: item.title,
      value: item.menuId,
    }));
    ctx.body = {
      code: 200,
      msg: "success",
      data: menus,
    };
  }
  /** 新增菜单 */
  async createMenu(ctx: AppRouterContext, next: Next) {
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
  }
  /** 更新菜单 */
  async editMenu(ctx: AppRouterContext, next: Next){
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
  }
  /** 删除菜单 */
  async deleteMenu(ctx: AppRouterContext, next: Next){
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
  }
}
