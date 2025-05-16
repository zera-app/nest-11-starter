import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, IsUUID, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @Length(0, 255)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(0, 255)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: 'Password is too weak, must contain at least 8 characters, 1 lowercase letter, 1 uppercase letter, 1 number and 1 symbol',
    },
  )
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(0, 255)
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message: 'Password confirmation is too weak, must contain at least 8 characters, 1 lowercase letter, 1 uppercase letter, 1 number and 1 symbol',
    },
  )
  password_confirmation: string;

  @IsOptional()
  @IsString({ each: true })
  @Length(0, 255, { each: true })
  @IsUUID('4', { each: true })
  roleIds: string[];
}
