import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ResendVerificationDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
