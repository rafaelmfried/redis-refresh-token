import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async retrieveToken(refresh_token: string): Promise<string> | null {
    const storedData = await this.cacheManager.get<string>(refresh_token);
    return storedData || null;
  }

  async storeToken(refresh_token: string): Promise<boolean> {
    try {
      await this.cacheManager.set(
        refresh_token,
        { refresh_token },
        parseInt(process.env.REDIS_TTL),
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteToken(refresh_token: string): Promise<boolean> {
    try {
      await this.cacheManager.del(refresh_token);
      return true;
    } catch (error) {
      return false;
    }
  }
}
