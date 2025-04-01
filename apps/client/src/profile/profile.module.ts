import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { MailModule } from '@app/common';

@Module({
  imports: [MailModule],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
