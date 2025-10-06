import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public get(key: string): Promise<number | undefined> {
    return this.cacheManager.get<number | undefined>(key);
  }

  public async set(key: string, value: number): Promise<void> {
    await this.cacheManager.set(key, value);
  }
}
