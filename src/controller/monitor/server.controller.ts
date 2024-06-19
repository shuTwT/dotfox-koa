import { BaseController } from "app/common/base/baseController";
import ServerService from "app/service/monitor/server.service";

const serverService = new ServerService()
export default class ServerController extends BaseController {
    async getInfo(ctx: AppRouterContext, next: Next){
        const info = await serverService.getInfo()
        ctx.body=super.ajaxSuccess(info) 
    }
}