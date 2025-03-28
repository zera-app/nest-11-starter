import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MailModule } from '@app/common';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [MailModule],
})
export class AuthModule {}
