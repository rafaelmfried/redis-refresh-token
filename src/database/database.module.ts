import { Module } from '@nestjs/common';
import { databaseProvides } from './database.providers';

@Module({
  providers: [...databaseProvides],
  exports: [...databaseProvides],
})
export class DatabaseModule {}
