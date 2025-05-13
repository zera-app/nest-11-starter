import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { CacheModule, MailModule } from '@app/common';

@Module({
  imports: [MailModule, CacheModule],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
