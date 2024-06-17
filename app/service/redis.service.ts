import { BaseService } from "app/common/base/baseService";
import redis from "app/utils/redis";
import { Redis } from "ioredis";

export default class RedisService extends BaseService {
    client:Redis
    constructor(){
        super()
        this.client = redis
    }
    async getInfo(){
        const rawInfo = await this.client.info()
        const lines = rawInfo.split('\r\n')
        const parsedInfo:Record<string,string> = {}
        lines.forEach((line)=>{
            const [key,value] = line.split(':')
            parsedInfo[key?.trim()] = value?.trim()
        })
        return parsedInfo
    }
     /**
   * 分页查询缓存数据
   * @param data
   * @returns
   */
  async skipFind(data: { key: string; pageSize: number; pageNum: number }) {
    const rawInfo = await this.client.lrange(data.key, (data.pageNum - 1) * data.pageSize, data.pageNum * data.pageSize);
    return rawInfo;
  }
  /**
   * 缓存Key数量
   * @returns
   */
  async getDbSize() {
    return await this.client.dbsize();
  }

  /**
   * 命令统计
   * @returns
   */
  async commandStats() {
    const rawInfo = await this.client.info('commandstats');
    // 按行分割字符串
    const lines = rawInfo.split('\r\n');
    const commandStats:any[] = [];
    // 遍历每一行并分割键值对
    lines.forEach((line) => {
      const [key, value] = line.split(':');
      if (key && value) {
        commandStats.push({
          name: key?.trim()?.replaceAll('cmdstat_', ''),
          value: +value?.trim()?.split(',')[0]?.split('=')[1],
        });
      }
    });
    return commandStats;
  }
  
}