import type { DefaultState, Context } from "koa";
import Router from "koa-router";
import jwt, { JwtPayload } from "jsonwebtoken";
import crypto from "node:crypto";
import { Captcha } from "captcha.gif";
import prisma from "../../utils/prisma";
import dayjs from "dayjs";
import redis from "../../utils/redis";
import { nanoid } from "nanoid";
import { getAddressByIp } from "../../common/utils/ip";

const authRouter = new Router<DefaultState, Context>();

const captcha = new Captcha();

type LoginBody = {
  username: string;
  password: string;
  uuid: string;
};

authRouter.post("/login", async (ctx, next) => {
  const md5 = crypto.createHash("md5");
  const body = ctx.request.body as LoginBody;
  const uuid = body.uuid;
  const ip = (ctx.headers["x-forwarded-for"] as string) || ctx.request.ip;
  const address = await getAddressByIp(ip)

  const md5password = md5.update(body.password).digest("hex");
  const user = await prisma.sysUser.findFirst({
    where: {
      userName: body.username,
      password: md5password,
    },
    select: {
      userId: true,
      userName: true,
      avatar:true,
      nickName:true
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
        roleId: item.roleId,
      },
    });
    if (userRole) {
      userRoles.push(userRole.roleKey);
    }
  }

  if (user == null) {
    ctx.body = {
      code: 500,
      msg: "用户不存在/密码错误",
    };
    return;
  }

  const expires = dayjs().add(10, "h");
  const systemInfo = `${ctx.ua.getOS().name}${ctx.ua.getOS().version}`;
  const browserInfo = `${ctx.ua.getBrowser().name}${
    ctx.ua.getBrowser().version
  }`;
  const accessToken = jwt.sign(
    {
      data: "foobar",
      userId: user.userId,
      username: user.userName,
      uuid: uuid,
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

  redis.setex("login_tokens:" + uuid, 60 * 60 * 10, accessToken);
  const refreshToken = jwt.sign(
    {
      data: "foobar",
      userId: user.userId,
      username: user.userName,
      uuid: uuid,
    },
    "shhhh",
    {
      expiresIn: "10h",
    }
  );

  ctx.body = {
    code: 200,
    msg: "success",
    data: {
      avatar: user.avatar,
      username: user.userName,
      nickname: user.nickName,
      permissions: ["*:*:*"],
      roles: userRoles,
      accessToken: accessToken,
      refreshToken: refreshToken,
      expires: expires,
    },
  };
});

authRouter.get("/captcha", async (ctx, next) => {
  const { token, buffer } = captcha.generate();
  const uuid = ctx.cookies.get("_uuid") ?? nanoid();
  redis.setex("login_captcha:" + uuid, 60, token);

  ctx.type = "image/gif";
  ctx.body = buffer;
});

type RefreshTokenBody = {
  refreshToken: string;
};
authRouter.post("refresh-token", async (ctx, next) => {
  const body = ctx.request.body as RefreshTokenBody;
  const ip = ctx.request.ip;
  const address = await getAddressByIp(ip)
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
        userName: decodeToken.username,
      },
      select: {
        userId: true,
        userName: true,
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
          roleId: item.roleId,
        },
      });
      if (userRole) {
        userRoles.push(userRole.roleKey);
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
});

authRouter.post("/logout", async (ctx, next) => {
  const token = ctx.request.header["authorization"];
  const tokenItem = token!.split("Bearer ")[1];
  const decode = jwt.verify(tokenItem, "shhhh") as JwtPayload;
  const uuid = decode.uuid;
  try {
    await redis.del("login_tokens:" + uuid);
    ctx.body = {
      code: 200,
      msg: "登出成功",
    };
  } catch (err) {
    ctx.body = {
      code: 500,
      msg: String(err),
    };
  }
});

authRouter.get("/getInfo", async (ctx, next) => {
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
        roleId: item.roleId,
      },
    });
    if (userRole) {
      userRoles.push(userRole.roleKey);
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
});



export { authRouter };
