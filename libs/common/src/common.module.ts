import { Module } from '@nestjs/common';
import { TokenCleanupModule } from './token-cleanup/token-cleanup.module';

@Module({
  providers: [],
  exports: [],
  imports: [TokenCleanupModule],
})
export class CommonModule {}
