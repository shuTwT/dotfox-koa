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
    const projectName= parseQuery(query, "name");
    const pageSize = str2num(parseQuery(query, "pageSize"), 10);
    const pageNum = str2num(parseQuery(query, "pageNum"), 1);
    const [records, count] = await prisma.$transaction([
      prisma.goviewProject.findMany({
        skip: (pageNum - 1) * pageSize,
        take: pageSize,
        where:{
            projectName:{
                contains: projectName,
            }
        }
      }),
      prisma.goviewProject.count({
        where:{
            projectName:{
                contains: projectName,
            }
        }
      }),
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
    const goviewProject = await prisma.goviewProject.create({
      data: {
        id: body.id,
        projectName: body.projectName,
        indexImage: body.indexImage,
        createBy: loginUser.getUserName(),
        remark: body.remarks,
      },
    });
    ctx.body = super.ajaxSuccess(goviewProject);
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
    const query = ctx.query
    const ids = parseQuery(query, "ids");
    if(ids){
        await prisma.goviewProject.deleteMany({
            where: {
              id: ids,
            },
          });
          ctx.body = {
            code: 200,
            msg: "success",
          };
    }
    
  }
  /**
   * 发布/取消项目状态
   */
  async publish(ctx: AppRouterContext, next: Koa.Next) {
    const body = ctx.request.body;
    if (body.state == "-1" || body.state == "1") {
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

      ctx.body = super.ajaxSuccess();
    } else {
      ctx.body = super.ajaxFailed("非法参数");
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
    if (goviewProject !== null && goviewProjectData !== null) {
      ctx.body = super.ajaxSuccess({
        ...goviewProject,
        content: goviewProjectData.content,
        version: goviewProjectData.version
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
        ctx.body=super.ajaxFailed("项目不存在");
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
        const content = JSON.stringify(JSON.parse(body.content))
        console.log(content)
        await prisma.goviewProjectData.create({
            data: {
              projectId: projectId,
              version: 1,
              content: body.content,
            },
          });
          ctx.body=super.ajaxSuccess("数据保存成功");
      } else {
        await prisma.goviewProjectData.create({
          data: {
            projectId: projectId,
            version: goviewProjectData.version + 1,
            content: body.content,
          },
        });
        ctx.body=super.ajaxSuccess("数据保存成功");
      }
    }
  }
  /**
   * 上传文件
   */
  async upload(ctx: AppRouterContext, next: Koa.Next) {
    const files = ctx.request.files;
    if (files) {
      if(!Array.isArray(files.object)){
        ctx.body=super.ajaxSuccess("上传成功", {
            bucketName:null,
            filePath: files.object.filepath,
            fileName: files.object.newFilename,
            originalFilename: files.object.originalFilename,
            url: "/upload/" + files.object.newFilename,
          });
      }
          
      
    } else {
      ctx.body=super.ajaxFailed("上传失败");
    }
  }
}
