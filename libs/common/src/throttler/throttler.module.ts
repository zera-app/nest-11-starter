import { Module } from '@nestjs/common';
import { ThrottlerModule as NodeThrottlerModule, seconds } from '@nestjs/throttler';

@Module({
  imports: [
    NodeThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: seconds(Number(process.env.THROTTLER_TTL) || 60),
          limit: Number(process.env.THROTTLER_LIMIT) || 100,
        },
      ],
    }),
  ],
  exports: [ThrottlerModule],
})
export class ThrottlerModule {}
