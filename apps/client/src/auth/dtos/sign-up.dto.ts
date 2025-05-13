import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Length } from 'class-validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @Length(0, 100)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(0, 255)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8)
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(8)
  @IsStrongPassword()
  password_confirmation: string;
}
