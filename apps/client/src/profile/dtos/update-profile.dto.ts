import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class updateProfileDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
