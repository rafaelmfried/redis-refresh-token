import { Injectable, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async retrieveData(bearer: string): Promise<string> {
    const storedData = await this.cacheManager.get<{ refresh_token?: string }>(
      bearer,
    );
    return storedData?.refresh_token || null;
  }
}
