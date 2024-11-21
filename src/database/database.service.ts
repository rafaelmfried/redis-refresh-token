import { Injectable } from '@nestjs/common';
import { TypeOrmService } from './services/typeorm.service';
import { RedisService } from './services/redis.service';
import { DataSource } from 'typeorm';
import { CacheStore } from '@nestjs/cache-manager';

@Injectable()
export class DatabaseService {
  constructor(
    private readonly typeOrmService: TypeOrmService,
    private readonly redisService: RedisService,
  ) {}

  async getTypeOrmConnection(): Promise<DataSource> {
    return this.typeOrmService.createConnection();
  }

  async getRedisConnection(): Promise<CacheStore> {
    return this.redisService.createConnection();
  }
}
