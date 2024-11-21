import { HttpException, Injectable } from '@nestjs/common';
import { CacheStore } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Injectable()
export class RedisService {
  async createConnection(): Promise<CacheStore> {
    try {
      const store = await redisStore({
        socket: {
          host: 'redis',
          port: 6379,
        },
      });
      return store as unknown as CacheStore;
    } catch (error) {
      console.error('Error connecting to Redis', error);
      throw new HttpException('Erro ao conectar com o Redis', 400);
    }
  }
}
