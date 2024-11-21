import { Global, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheController } from './cache.controller';

@Global()
@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      isGlobal: true,
      store: redisStore,
      socket: {
        host: 'redis',
        port: 6379,
      },
    }),
  ],
  providers: [CacheService],
  controllers: [CacheController],
  exports: [CacheService],
})
export class AppCacheModule {}
