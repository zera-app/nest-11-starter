import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  token: string;

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
