import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CommonModule } from './commom/common.module';
import { DatabaseModule } from './database/database.module';
// import { RedisModule } from 'nestjs-redis';
// import { Logger } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { AppCacheModule } from './cache/cache.module';

// RedisModule.register({
//   host: 'redis',
//   port: 6379,
//   onClientReady(client) {
//     client.on('error', (err) => {
//       console.error(err);
//     });
//     new Logger.log('Redis client is ready');
//   },
// }),

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    CommonModule,
    UsersModule,
    // AuthModule,
    AppCacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
