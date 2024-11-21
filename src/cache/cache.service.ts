import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async retrieveToken(token: string): Promise<string> | null {
    const storedData = await this.cacheManager.get<{ refresh_token?: string }>(
      token,
    );
    return storedData?.refresh_token || null;
  }

  async storeToken(token: string): Promise<boolean> {
    try {
      await this.cacheManager.set(token, { refresh_token: token }, 300_000);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
