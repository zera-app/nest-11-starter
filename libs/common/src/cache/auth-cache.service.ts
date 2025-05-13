import { UserInformation } from '@app/repositories';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async set(
    key: string,
    value: UserInformation,
    tokenValue: {
      token: string;
      expiresAt: Date | null;
    },
  ): Promise<void> {
    const data = {
      userInformation: value,
      tokenInformation: tokenValue,
    };

    const ttl = (Number(process.env.REDIS_TTL) || 3600) * 1000;

    await this.cacheManager.set(key, data, ttl);
  }

  async get(key: string): Promise<{ userInformation: UserInformation; tokenInformation: { token: string; expiresAt: Date | null } } | null> {
    const cache = await this.cacheManager.get(key);
    if (cache) {
      return cache as {
        userInformation: UserInformation;
        tokenInformation: {
          token: string;
          expiresAt: Date | null;
        };
      };
    }

    return null;
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  generateCacheKey(token: string): string {
    return `auth:${token}`;
  }
}
