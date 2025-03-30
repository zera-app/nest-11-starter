import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { BullmqModule, CacheModule, TokenCleanupModule } from '@app/common';

@Module({
  imports: [AuthModule, TokenCleanupModule, CacheModule, BullmqModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
