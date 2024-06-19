import { BaseController } from "src/common/base/baseController";
import {CacheService} from "src/service/monitor/cache.service";
import redis from "src/utils/redis";

const cacheService = new CacheService()
export default class CacheController extends BaseController {
    async getInfo(ctx: AppRouterContext, next: Next){
        const info = await cacheService.getInfo()
        ctx.body=super.ajaxSuccess(info)
    }
    async getNames(ctx: AppRouterContext, next: Next){

    }
    async getKeys(ctx: AppRouterContext, next: Next){

    }
    async getValue(ctx: AppRouterContext, next: Next){

    }
    async clearCacheName(ctx: AppRouterContext, next: Next){

    }
    async clearCacheKey(ctx: AppRouterContext, next: Next){

    }
    async clearCacheAll(ctx: AppRouterContext, next: Next){

    }
}