import { Module } from '@nestjs/common';
import { TokenCleanupModule } from './token-cleanup/token-cleanup.module';
import { ThrottlerModule } from './throttler/throttler.module';

@Module({
  providers: [],
  exports: [],
  imports: [TokenCleanupModule, ThrottlerModule],
})
export class CommonModule {}
