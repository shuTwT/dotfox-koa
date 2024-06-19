import { Provide } from '@midwayjs/core';
import {RedisService} from "../redis.service";

const redisService = new RedisService()
@Provide()
export class CacheService {
    
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