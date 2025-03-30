import { Module } from '@nestjs/common';
import { CacheModule as NestCacheManager } from '@nestjs/cache-manager';
import { createKeyv, Keyv } from '@keyv/redis';
import { CacheableMemory } from 'cacheable';

@Module({
  imports: [
    NestCacheManager.registerAsync({
      useFactory: () => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({
                ttl: Number(process.env.REDIS_TLL) || 3600,
                lruSize: 5000,
              }),
              namespace: 'cacheable',
            }),
            createKeyv(
              `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
            ),
          ],
          isGlobal: true,
          // ttl: Number(process.env.REDIS_TTL) || 3600,
          // host: process.env.REDIS_HOST,
          // port: Number(process.env.REDIS_PORT),
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class CacheModule {}
