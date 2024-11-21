import { forwardRef, Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfigService } from '../config/services/datasource-config.service';
import { TypeOrmConfigService } from 'src/config/services/typeorm-config.service';
import { ConfigModule } from 'src/config/config.module';
import { DatabaseService } from './database.service';
import { TypeOrmService } from './services/typeorm.service';
import { RedisService } from './services/redis.service';

@Global()
@Module({
  imports: [
    forwardRef(() => ConfigModule),
    TypeOrmModule.forRootAsync({
      imports: [forwardRef(() => ConfigModule)],
      inject: [TypeOrmConfigService],
      useFactory: async (typeOrmConfigService: TypeOrmConfigService) => {
        const typeOrmConfig = typeOrmConfigService.createTypeOrmOptions();
        return typeOrmConfig;
      },
    }),
  ],
  providers: [
    DatabaseService,
    TypeOrmService,
    DataSourceConfigService,
    RedisService,
    // {
    //   provide: 'DATA_SOURCE',
    //   inject: [DatabaseService],
    //   useFactory: async (databaseService: DatabaseService) => {
    //     return await databaseService.getTypeOrmConnection();
    //   },
    // },
  ],
  exports: [DatabaseService, DataSourceConfigService],
})
export class DatabaseModule {}
