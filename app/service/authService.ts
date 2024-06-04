import { BaseService } from "app/common/base/baseService";
import prisma from "app/utils/prisma";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Captcha } from "captcha.gif";
import redis from "app/utils/redis";
import crypto from "node:crypto";
import { getAddressByIp } from "app/common/utils/ip";
import { parseQuery, str2num } from "app/utils/utils";
import { nanoid } from "nanoid";
import dayjs from "dayjs";

const captcha = new Captcha();

export default class AuthService extends BaseService {
  async login(uuid:string,username:string,password:string,ip:string,ua:any) {
    const md5 = crypto.createHash("md5");
    const address = await getAddressByIp(ip);

    const md5password = md5.update(password).digest("hex");
    const user = await prisma.sysUser.findFirst({
      where: {
        username: username,
        password: md5password,
      },
      select: {
        userId: true,
        username: true,
        avatar: true,
        nickname: true,
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

    if (user == null) {
      throw "用户不存在/密码错误"
    }

    const expires = dayjs().add(10, "h");
    const systemInfo = `${ua.getOS().name}${ua.getOS().version}`;
    const browserInfo = `${ua.getBrowser().name}${
      ua.getBrowser().version
    }`;
    const accessToken = jwt.sign(
      {
        data: "foobar",
        userId: user.userId,
        username: user.username,
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
        username: user.username,
        uuid: uuid,
      },
      "shhhh",
      {
        expiresIn: "10h",
      }
    );
    return {
        user,
        userRoles,
        accessToken,
        refreshToken,
        expires,
    };
  }
}
