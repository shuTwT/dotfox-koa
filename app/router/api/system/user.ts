import type { DefaultState, Context } from "koa";
import Router from "koa-router";
import prisma from "../../../utils/prisma";
import { parseQuery, str2num } from "../utils";
import dayjs from "dayjs";
import { SysUser } from "@prisma/client";

const userRouter = new Router<DefaultState, Context>({ prefix: "/user" });

/** 获取系统管理-用户管理列表 */
userRouter.get("/", async (ctx, next) => {
  const query = ctx.query as any;
  const username = parseQuery(query, "username");
  const status = parseQuery(query, "status");
  const phone = parseQuery(query, "phone");
  const deptId = str2num(parseQuery(query, "deptId"), void 0);
  const pageSize = str2num(parseQuery(query, "pageSize"), 10);
  const pageNum = str2num(parseQuery(query, "pageNum"), 1);
  try {
    const [list, count] = await prisma.$transaction([
      prisma.sysUser.findMany({
        where: {
          userName: username,
          status: status,
          phonenumber: phone,
          deptId: deptId,
        },
        omit:{
            password:true
        },
        include: {
          dept: true,
        },
        skip: (pageNum - 1) * pageSize,
        take: pageSize,
        orderBy: {
          createTime: "desc",
        },
      }),
      prisma.sysUser.count({
        where: {
          userName: username,
          status: status,
          phonenumber: phone,
          deptId: deptId,
        },
      }),
    ]);
    ctx.body = {
      code: 200,
      msg: "success",
      data: {
        list,
        total: count,
        pageSize: pageSize,
        currentPage: pageNum,
      },
    };
  } catch (error) {
    ctx.body = {
      code: 500,
      msg: String(error),
    };
  }
});

/** 新增用户 */
userRouter.post("/", async (ctx, next) => {
  const body = ctx.request.body as any;
  const date = dayjs();
  const loginUser = ctx.getLoginUser();
  try {
    await prisma.sysUser.create({
      data: {
        userName: body.userName,
        nickName: body.nickName,
        email: body.email,
        deptId: Number(body.parentId),
        password: body.password,
        phonenumber: body.phonenumber,
        createBy: loginUser.getUserName(),
        remark: body.remark,
      },
    });
    ctx.body = {
      success: true,
      msg: "新增成功",
    };
  } catch (error) {
    ctx.body = {
      success: false,
      msg: error,
    };
  }
});

userRouter.get("/profile", async (ctx, next) => {
  const loginUser = ctx.getLoginUser();
  try {
    const user = await prisma.sysUser.findFirst({
      where: {
        userId: loginUser.userId,
      },
      omit:{
        password:true
      }
    });
    if (user) {
        ctx.body = {
          code: 200,
          msg: "success",
          data: user,
        };
    } else {
      ctx.body = {
        code: 500,
        msg: "找不到用户",
      };
    }
  } catch (error) {
    ctx.log4js.error(error);
    ctx.body = {
      code: 500,
      msg: String(error),
    };
  }
});

/**
 * 头像上传
 */
userRouter.post("/profile/avatar", async (ctx, next) => {
  const loginUser = ctx.getLoginUser();
  if (ctx.request.files) {
    const { file } = ctx.request.files;
    if (file) {
      if (!Array.isArray(file)) {
        await prisma.sysUser.update({
          where: {
            userId: loginUser.userId,
          },
          data: {
            avatar: "/upload/" + file.newFilename,
          },
        });
        ctx.body = {
          code: 200,
          msg: "上传成功",
          data: {
            filepath: file.filepath,
            filename: file.newFilename,
            originalfilename: file.originalFilename,
            url: "/upload/" + file.newFilename,
          },
        };
      }
    }
  } else {
    ctx.body = {
      code: 500,
      msg: "上传失败",
    };
  }
});

userRouter.get("/profile/logs", async (ctx, next) => {
  ctx.body = {
    code: 200,
    msg: "success",
    data: {
      list: [],
      total: 0,
    },
  };
});

/**
 * 查询用户详细信息
 */
userRouter.get("/:userId", async (ctx, next) => {
  const userId = ctx.params["userId"];
  try {
    const user = await prisma.sysUser.findFirst({
      where: {
        userId: Number(userId),
      },
      omit:{
        password:true
      }
    });

    if (user) {
      
      ctx.body = {
        code: 200,
        msg: "success",
        data: user,
      };
    } else {
      ctx.body = {
        code: 500,
        msg: "未找到该用户",
      };
    }
  } catch (error) {
    ctx.log4js.error(error);
    ctx.body = {
      code: 500,
      msg: String(error),
    };
  }
});

/** 修改用户 */
userRouter.put("/:userId", async (ctx, next) => {
  const userId = ctx.params["userId"];
  const body = ctx.request.body as any;
  const date = dayjs();
  const loginUser = ctx.getLoginUser();
  try {
    await prisma.sysUser.update({
      where: {
        userId: Number(userId),
      },
      data: {
        userName: body.userName,
        nickName: body.nickName,
        email: body.email,
        deptId: Number(body.parentId),
        password: body.password,
        phonenumber: body.phonenumber,
        updateBy: loginUser.getUserName(),
        remark: body.remark,
      },
    });
    ctx.body = {
      success: true,
      msg: "修改成功",
    };
  } catch (error) {
    ctx.body = {
      success: false,
      msg: error,
    };
  }
});

/** 修改用户状态 */
userRouter.put("/:userId/status", async (ctx, next) => {
  const userId = ctx.params["userId"];
  const body = ctx.request.body as any;
  try {
    await prisma.sysUser.update({
      where: {
        userId: Number(userId),
      },
      data: {
        status: body.state,
      },
    });
    ctx.body = {
      success: true,
      msg: "修改成功",
    };
  } catch (error) {
    ctx.body = {
      success: false,
      msg: error,
    };
  }
});

/** 删除用户 */
userRouter.delete("/:userId", async (ctx, next) => {
  const userId = ctx.params["userId"];
  const body = ctx.request.body as any;
  try {
    await prisma.sysUser.update({
      where: {
        userId: Number(userId),
      },
      data: {
        delFlag: true,
      },
    });
    ctx.body = {
      success: true,
      msg: "删除成功",
    };
  } catch (error) {
    ctx.body = {
      success: false,
      msg: error,
    };
  }
});
export { userRouter };
