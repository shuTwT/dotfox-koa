import { BaseController } from "app/common/base/baseController";
import CacheService from "app/service/monitor/cache.service";
import redis from "app/utils/redis";

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