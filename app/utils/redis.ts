import Redis from "ioredis";

const redisClientSingleton = () => {
  return new Redis({
    port: Number(process.env.REDIS_PORT) || 6789,
    host: process.env.REDIS_HOST ?? "127.0.0.1",
    password:process.env.REDIS_PWD ?? ''
  });
};

const globalForPrisma = globalThis as unknown as {
  redis: Redis | undefined;
};

const redis = globalForPrisma.redis ?? redisClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.redis = redis;

export default redis;
