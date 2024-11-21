import { Module } from '@nestjs/common';
import { DataSourceConfigService } from './services/datasource-config.service';
import { TypeOrmConfigService } from './services/typeorm-config.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [DataSourceConfigService, TypeOrmConfigService, ConfigService],
  exports: [DataSourceConfigService, TypeOrmConfigService, ConfigService],
})
export class ConfigModule {}
