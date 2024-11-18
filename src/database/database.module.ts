import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSourceConfigService } from 'src/config/datasource-config.service';
import { TypeOrmConfigService } from 'src/config/typeorm-config.service';
import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';

@Global()
@Module({
  imports: [
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
          const dataSourceConfig =
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
