import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { AuthModule } from './auth/auth.module';
import { BullmqModule, CacheModule } from '@app/common';
import { ProfileModule } from './profile/profile.module';

@Module({
  imports: [AuthModule, CacheModule, BullmqModule, ProfileModule],
  controllers: [ClientController],
  providers: [],
})
export class ClientModule {}
