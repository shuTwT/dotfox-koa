import { BaseService } from "app/common/base/baseService";
import RedisService from "../redis.service";

const redisService = new RedisService()
export default class CacheService extends BaseService {
    
    /**
     * 缓存监控
     * @returns 
     */
    async getInfo(){
        const info = await redisService.getInfo()
        const dbSize = await redisService.getDbSize()
        const commandStats = await redisService.commandStats()
        return {
            dbSize,
            info,
            commandStats
        }
    }
}