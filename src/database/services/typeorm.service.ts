import { HttpException, Injectable } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';
import { DataSourceConfigService } from 'src/config/services/datasource-config.service';

@Injectable()
export class TypeOrmService {
  constructor(private dataSourceConfigService: DataSourceConfigService) {}

  async createConnection(): Promise<DataSource> {
    try {
      const dataSourceConfig: DataSourceOptions =
        this.dataSourceConfigService.createDataSourceOptions();
      const dataSource = new DataSource(dataSourceConfig);
      await dataSource.initialize();
      console.log('Database connected successfully');
      return dataSource;
    } catch (error) {
      console.error('Error connecting to database:', error);
      throw new HttpException('Erro ao criar o datasource', 400);
    }
  }
}
