import { Module } from '@nestjs/common';
import { DataSourceConfigService } from './datasource-config.service';
import { TypeOrmConfigService } from './typeorm-config.service';

@Module({
  providers: [DataSourceConfigService, TypeOrmConfigService],
  exports: [DataSourceConfigService, TypeOrmConfigService],
})
export class ConfigModule {}
