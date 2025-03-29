import { Module } from '@nestjs/common';
import { TokenCleanupService } from './token-cleanup.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  providers: [TokenCleanupService],
  imports: [ScheduleModule.forRoot()],
  exports: [TokenCleanupService],
})
export class TokenCleanupModule {}
