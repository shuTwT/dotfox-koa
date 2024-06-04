import { BaseController } from "app/common/base/baseController";
import type Koa from "koa";
import prisma from "app/utils/prisma";
import { parseQuery, str2num } from "app/utils/utils";
import dayjs from "dayjs";

export default class GoviewProjectController extends BaseController {
  /**
   * project分页列表
   */
  async list(ctx: AppRouterContext, next: Koa.Next) {
    const query = ctx.request.query;
    const pageSize = str2num(parseQuery(query, "pageSize"), 10);
    const pageNum = str2num(parseQuery(query, "pageNum"), 1);
    const [records, count] = await prisma.$transaction([
      prisma.goviewProject.findMany({
        skip: (pageNum - 1) * pageSize,
        take: pageSize,
      }),
      prisma.goviewProject.count(),
    ]);
    ctx.body = {
      code: 200,
      count,
      msg: "success",
      data: records,
    };
  }
  /**
   * 新增
   */
  async create(ctx: AppRouterContext, next: Koa.Next) {
    const body = ctx.request.body;
    const loginUser = ctx.getLoginUser();
    const goviewProject=await prisma.goviewProject.create({
      data: {
        id: body.id,
        projectName: body.projectName,
        indexImage: body.indexImage,
        createBy: loginUser.getUserName(),
        remark: body.remarks,
      },
    });
    ctx.body=super.ajaxSuccess(goviewProject)
  }
  /**
   * 修改
   */
  async edit(ctx: AppRouterContext, next: Koa.Next) {
    const body = ctx.request.body;
    const loginUser = ctx.getLoginUser();
    await prisma.goviewProject.update({
      where: {
        id: body.id,
      },
      data: {
        projectName: body.projectName,
        state: body.state,
        indexImage: body.indexImage,
        updateBy: loginUser.getUserName(),
        remark: body.remark,
      },
    });
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
  /**
   * 重命名
   */
  async rename(ctx: AppRouterContext, next: Koa.Next) {
    const body = ctx.request.body;
    const loginUser = ctx.getLoginUser();
    await prisma.goviewProject.update({
      where: {
        id: body.id,
      },
      data: {
        projectName: body.projectName,
        updateBy: loginUser.getUserName(),
      },
    });
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
  /**
   * 移除
   */
  async remove(ctx: AppRouterContext, next: Koa.Next) {
    const ids = ctx.params["ids"];
    await prisma.goviewProject.deleteMany({
      where: {
        id: {
          in: ids.split(","),
        },
      },
    });
    ctx.body = {
      code: 200,
      msg: "success",
    };
  }
  /**
   * 发布/取消项目状态
   */
  async publish(ctx: AppRouterContext, next: Koa.Next) {
    const body = ctx.request.body;
    if (body.state === "-1" || body.state === "1") {
      const loginUser = ctx.getLoginUser();
      await prisma.goviewProject.update({
        where: {
          id: body.id,
        },
        data: {
          state: Number(body.state),
          updateBy: loginUser.getUserName(),
        },
      });
      ctx.body = {
        code: 200,
        msg: "success",
      };
    } else {
      this.ajaxFailed("非法参数");
    }
  }
  /**
   * 获取项目存储数据
   */
  async getData(ctx: AppRouterContext, next: Koa.Next) {
    const query = ctx.request.query;
    const projectId = parseQuery(query, "projectId");
    const goviewProject = await prisma.goviewProject.findFirst({
      where: {
        id: projectId,
      },
    });
    const goviewProjectData = await prisma.goviewProjectData.findFirst({
      where: {
        projectId: projectId,
      },
      orderBy: {
        version: "desc",
      },
    });
    if (goviewProject !==null &&goviewProjectData !== null) {
      ctx.body = super.ajaxSuccess({
        ...goviewProject,
        content: goviewProjectData.content,
      });
    } else {
      ctx.body = super.ajaxSuccess("项目数据不存在");
    }
  }
  /**
   * 保存项目数据
   */
  async saveData(ctx: AppRouterContext, next: Koa.Next) {
    const body = ctx.request.body;
    const projectId = body.projectId;
    const goviewProject = await prisma.goviewProject.findFirst({
      where: {
        id: projectId,
      },
    });
    if (goviewProject === null) {
      super.ajaxFailed("项目不存在");
    } else {
      const goviewProjectData = await prisma.goviewProjectData.findFirst({
        where: {
          projectId: projectId,
        },
        orderBy: {
          version: "desc",
        },
      });
      if (goviewProjectData === null) {
        super.ajaxFailed("项目数据不存在");
      } else {
        await prisma.goviewProjectData.create({
          data: {
            projectId: projectId,
            version: goviewProjectData.version + 1,
            content: body.content,
          },
        });
        super.ajaxSuccess("数据保存成功")
      }
    }
  }
  /**
   * 上传文件
   */
  async upload(ctx: AppRouterContext, next: Koa.Next) {
    const files = ctx.request.files;
    if (ctx.request.files) {
      const { file } = ctx.request.files;
      if (file) {
        if (!Array.isArray(file)) {
          this.ajaxSuccess("上传成功", {
            filepath: file.filepath,
            filename: file.newFilename,
            originalfilename: file.originalFilename,
            url: "/upload/" + file.newFilename,
          });
        }
      }
    } else {
      this.ajaxFailed("上传失败");
    }
  }
}
