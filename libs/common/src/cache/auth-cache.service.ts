import { UserInformation } from '@app/repositories';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async setUserInfo(userId: string, userInfo: UserInformation): Promise<void> {
    const key = this.generateUserCacheKey(userId);
    const ttl = (Number(process.env.REDIS_TTL) || 3600) * 1000;
    await this.cacheManager.set(key, userInfo, ttl);
  }

  async getUserInfo(userId: string): Promise<UserInformation | null> {
    const key = this.generateUserCacheKey(userId);
    const cache = await this.cacheManager.get(key);
    return cache as UserInformation | null;
  }

  async deleteUserInfo(userId: string): Promise<void> {
    const key = this.generateUserCacheKey(userId);
    await this.cacheManager.del(key);
  }

  generateUserCacheKey(userId: string): string {
    return `user:${userId}`;
  }
}
