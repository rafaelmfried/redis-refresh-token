import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async retrieveToken(refresh_token: string): Promise<string> | null {
    console.log(refresh_token);
    const storedData = await this.cacheManager.get<string>(refresh_token);
    return storedData || null;
  }

  async storeToken(refresh_token: string): Promise<boolean> {
    console.log('service: ', refresh_token);
    try {
      await this.cacheManager.set(
        refresh_token,
        { refresh_token },
        300_000_000,
      );
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}
