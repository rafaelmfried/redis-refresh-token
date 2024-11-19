import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheController } from './cache.controller';

@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      socket: {
        host: 'redis',
        port: 6379,
      },
    }),
  ],
  providers: [CacheService],
  controllers: [CacheController],
})
export class AppCacheModule {}
