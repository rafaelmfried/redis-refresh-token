import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CommonModule } from './commom/common.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';
import { AppCacheModule } from './cache/cache.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    CommonModule,
    UsersModule,
    AppCacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
