import { Body, Controller, Get, Post } from '@nestjs/common';
import { CacheService } from './cache.service';

@Controller('cache')
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @Get()
  async getCache(@Body() refresh_token: string): Promise<any> {
    return this.cacheService.retrieveToken(refresh_token);
  }

  @Post()
  async setCache(@Body() refresh_token: string): Promise<any> {
    return this.cacheService.storeToken(refresh_token);
  }
}
