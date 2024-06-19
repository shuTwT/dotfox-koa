import { BaseController } from "app/common/base/baseController";
import prisma from "app/utils/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Captcha } from "captcha.gif";
import redis from "app/utils/redis";
import crypto from "node:crypto";
import { getAddressByIp } from "app/common/utils/ip";
import { parseQuery, str2num } from "app/utils/utils";
import { nanoid } from "nanoid";
import dayjs from "dayjs";
import AuthService from "app/service/authService";
import { Controller, Inject, Post } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";

type LoginBody = {
  username: string;
  password: string;
  uuid: string;
};

type RefreshTokenBody = {
  refreshToken: string;
};

const captcha = new Captcha();

const authService = new AuthService()

@Controller()
export default class AuthController extends BaseController {
  @Inject()
  ctx:Context;
  @Post('/login')
  async login(ctx: AppRouterContext, next: Next) {
    const body = ctx.request.body;
    const uuid = body.uuid;
    const username = body.username
    const password = body.password
    const ip = (ctx.headers["x-forwarded-for"] as string) || ctx.request.ip;
    const result = await authService.login(uuid,username,password,ip,ctx.ua)
    const {user,userRoles,accessToken,refreshToken,expires} = result
    ctx.body=super.ajaxSuccess({
      avatar: user.avatar,
      username: user.username,
      nickname: user.nickname,
      permissions: ["*:*:*"],
      roles: userRoles,
      accessToken: accessToken,
      refreshToken: refreshToken,
      expires: expires,
    })
  }
  async captcha(ctx: AppRouterContext, next: Next) {
    const { token, buffer } = captcha.generate();
    const uuid = ctx.cookies.get("_uuid") ?? nanoid();
    redis.setex("login_captcha:" + uuid, 60, token);

    ctx.type = "image/gif";
    ctx.body = buffer;
  }
  async refreshToken(ctx: AppRouterContext, next: Next) {
    const body = ctx.request.body as RefreshTokenBody;
    const ip = ctx.request.ip;
    const address = await getAddressByIp(ip);
    if (body.refreshToken == null) {
      ctx.body = {
        code: 500,
        msg: "refreshToken不能为空",
      };
      return;
    }
    let decodeToken;
    try {
      decodeToken = jwt.verify(body.refreshToken, "shhhh") as JwtPayload;
    } catch {
      ctx.body = {
        code: 500,
        msg: "refreshToken错误",
      };
      return;
    }
    if (decodeToken.userId && decodeToken.username && decodeToken.roles) {
      const expires = dayjs().add(10, "h");
      const systemInfo = `${ctx.ua.getOS().name}${ctx.ua.getOS().version}`;
      const browserInfo = `${ctx.ua.getBrowser().name}${
        ctx.ua.getBrowser().version
      }`;

      const user = await prisma.sysUser.findFirst({
        where: {
          username: decodeToken.username,
        },
        select: {
          userId: true,
          username: true,
        },
      });
      const userRoleIds = await prisma.sysUserRole.findMany({
        where: {
          userId: user?.userId,
        },
      });
      const userRoles = [];
      for (const key in userRoleIds) {
        const item = userRoleIds[key];
        const userRole = await prisma.sysRole.findFirst({
          where: {
            id: item.roleId,
          },
        });
        if (userRole) {
          userRoles.push(userRole.code);
        }
      }

      const accessToken = jwt.sign(
        {
          data: "foobar",
          userId: decodeToken.userId,
          username: decodeToken.userName,
          uuid: decodeToken.uuid,
          ip: ip,
          address: address,
          system: systemInfo,
          browser: browserInfo,
          loginTime: new Date(),
          permissions: ["*:*:*"],
        },
        "shhhh",
        {
          expiresIn: "10h",
        }
      );

      redis.setex(
        "login_tokens:" + decodeToken.uuid,
        60 * 60 * 10,
        accessToken
      );
      const refreshToken = jwt.sign(
        {
          data: "foobar",
          userId: decodeToken.userId,
          username: decodeToken.userName,
          uuid: decodeToken.uuid,
        },
        "shhhh",
        {
          expiresIn: "10h",
        }
      );
      ctx.body = {
        code: 200,
        data: {
          username: decodeToken.userName,
          permissions: ["*:*:*"],
          roles: userRoles,
          accessToken: accessToken,
          refreshToken: refreshToken,
          expires: expires,
        },
        msg: "success",
      };
      return;
    } else {
      ctx.body = {
        code: 500,
        msg: "refreshToken错误",
      };
      return;
    }
  }
  async logout(ctx: AppRouterContext, next: Next) {
    const token = ctx.request.header["authorization"];
    const tokenItem = token!.split("Bearer ")[1];
    const decode = jwt.verify(tokenItem, "shhhh") as JwtPayload;
    const uuid = decode.uuid;

    await redis.del("login_tokens:" + uuid);
    ctx.body = {
      code: 200,
      msg: "登出成功",
    };
  }
  async getInfo(ctx: AppRouterContext, next: Next) {
    const loginUser = ctx.getLoginUser();
    const user = await prisma.sysUser.findFirst({
      where: {
        userId: loginUser.userId,
      },
    });
    const userRoleIds = await prisma.sysUserRole.findMany({
      where: {
        userId: user?.userId,
      },
    });
    const userRoles = [];
    for (const key in userRoleIds) {
      const item = userRoleIds[key];
      const userRole = await prisma.sysRole.findFirst({
        where: {
          id: item.roleId,
        },
      });
      if (userRole) {
        userRoles.push(userRole.code);
      }
    }
    ctx.body = {
      code: 200,
      msg: "success",
      data: {
        permissions: loginUser.getPermissions(),
        roles: userRoles,
        user: user,
      },
    };
  }
}
