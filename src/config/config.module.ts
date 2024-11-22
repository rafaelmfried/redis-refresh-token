import { Module } from '@nestjs/common';
import { DataSourceConfigService } from './services/datasource-config.service';
import { TypeOrmConfigService } from './services/typeorm-config.service';

@Module({
  providers: [DataSourceConfigService, TypeOrmConfigService],
  exports: [DataSourceConfigService, TypeOrmConfigService],
})
export class ConfigModule {}
