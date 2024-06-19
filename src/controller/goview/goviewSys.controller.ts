import { BaseController } from "src/common/base/baseController";
import type Koa from "koa";
import prisma from "src/utils/prisma";
import { parseQuery, str2num } from "src/utils/utils";
import dayjs from "dayjs";
import {AuthService} from "src/service/auth.service";
import { nanoid } from "nanoid";

const authService = new AuthService()

export default class GoviewSysController extends BaseController {
    async login(ctx: AppRouterContext, next: Next) {
        const body = ctx.request.body;
        const uuid = nanoid();
        const username = body.username
        const password = body.password
        const ip = (ctx.headers["x-forwarded-for"] as string) || ctx.request.ip;
        const result = await authService.login(uuid,username,password,ip,ctx.ua)
        const {user,userRoles,accessToken,refreshToken,expires} = result
        ctx.body=super.ajaxSuccess({
            token:{
                tokenName:"Authorization",
                tokenValue:"Bearer "+accessToken,
            },
            userinfo:{
                id:user.userId,
                nickname:user.nickname,
                username:user.username
            }
        })
    }
    async getOssInfo(ctx: AppRouterContext, next: Next) {
        const bucketURL = process.env.bucketURL ?? "https://admin.mtruning.club/static/file_upload/"
        ctx.body=super.ajaxSuccess({
            //bucketURL:"https://admin.mtruning.club/static/file_upload/"
            bucketURL:bucketURL
        })
    }
}