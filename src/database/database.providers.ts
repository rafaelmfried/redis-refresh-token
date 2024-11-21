import { DataSource } from 'typeorm';
import { DataSourceConfigService } from 'src/config/services/datasource-config.service';

export const databaseProvides = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (dataSourceConfigService: DataSourceConfigService) => {
      try {
        const dataSource = new DataSource(
          dataSourceConfigService.createDataSourceOptions(),
        );
        console.log('Connection with database established');
        return dataSource.initialize();
      } catch (error) {
        console.log('Error to start database connection.');
      }
    },
    inject: [DataSourceConfigService],
  },
];
