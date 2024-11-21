import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfigService } from '../config/services/datasource-config.service';
import { TypeOrmConfigService } from 'src/config/services/typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Logger } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
  ],
  providers: [
    {
      provide: DataSource,
      useFactory: async () => {
        try {
          const dataSourceConfigService = new DataSourceConfigService();
          const dataSourceConfig: DataSourceOptions =
            dataSourceConfigService.createDataSourceOptions();
          const dataSource = new DataSource(dataSourceConfig);
          await dataSource.initialize();
          new Logger('MACACO_ALADO').log('Database connect succesfully');
          // console.log('Database connected successfully');
          return dataSource;
        } catch (error) {
          console.error('Erro connecting to database');
          throw new Error('Erro ao conectar db');
        }
      },
    },
  ],
  exports: [DataSource],
})
export class DatabaseModule {}
