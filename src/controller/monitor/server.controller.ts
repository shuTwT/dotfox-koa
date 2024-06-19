import { BaseController } from "src/common/base/baseController";
import {ServerService} from "src/service/monitor/server.service";

const serverService = new ServerService()
export default class ServerController extends BaseController {
    async getInfo(ctx: AppRouterContext, next: Next){
        const info = await serverService.getInfo()
        ctx.body=super.ajaxSuccess(info) 
    }
}