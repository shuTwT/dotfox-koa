import type { DefaultState, Context } from "koa";
import Router from "koa-router";
import AuthController from "app/controller/authController";

const authRouter = new Router<DefaultState, Context>();
const authController = new AuthController()

authRouter.post("/login",authController.login);
authRouter.get("/captcha",authController.captcha);
authRouter.post("/refresh-token",authController.refreshToken);
authRouter.post("/logout", authController.logout);
authRouter.get("/getInfo",authController.getInfo);

export { authRouter };
