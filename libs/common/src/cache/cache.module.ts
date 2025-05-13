import { Global, Module } from '@nestjs/common';
import { CacheModule as NestCacheManager } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { AuthCacheService } from './auth-cache.service';
import { CacheService } from './cache.service';

@Global()
@Module({
  imports: [
    NestCacheManager.registerAsync({
      useFactory: () => ({
        store: redisStore,
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        ttl: (Number(process.env.REDIS_TTL) || 3600) * 1000,
      }),
    }),
  ],
  providers: [AuthCacheService, CacheService],
  exports: [AuthCacheService, CacheService],
})
export class CacheModule {}
