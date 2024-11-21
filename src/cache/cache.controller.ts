import { Body, Controller, Post } from '@nestjs/common';
import { CacheService } from './cache.service';
import { RefreshTokenCache } from './dto/refresh_token_cache.dto';

@Controller('cache')
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @Post('get')
  async getCache(@Body() refreshTokenCache: RefreshTokenCache): Promise<any> {
    console.log(refreshTokenCache.refresh_token);
    return (await this.cacheService.retrieveToken(
      refreshTokenCache.refresh_token,
    ))
      ? 'Encontrado'
      : 'Não encontrado';
  }

  @Post('set')
  async setCache(@Body() refreshTokenCache: RefreshTokenCache): Promise<any> {
    console.log(refreshTokenCache.refresh_token);
    return (await this.cacheService.storeToken(refreshTokenCache.refresh_token))
      ? 'Token setado'
      : 'Token não setado';
  }
}
