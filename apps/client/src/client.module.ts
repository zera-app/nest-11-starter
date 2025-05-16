import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { AuthModule } from './auth/auth.module';
import { BullmqModule, CacheModule } from '@app/common';
import { ProfileModule } from './profile/profile.module';
import { ThrottlerModule } from '@app/common/throttler/throttler.module';

@Module({
  imports: [AuthModule, CacheModule, BullmqModule, ProfileModule, ThrottlerModule],
  controllers: [ClientController],
  providers: [],
})
export class ClientModule {}
