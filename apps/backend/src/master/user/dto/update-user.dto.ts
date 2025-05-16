import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsString, IsStrongPassword, Length } from 'class-validator';

export class UpdateUserDto extends OmitType(CreateUserDto, ['password', 'password_confirmation']) {
  @IsOptional()
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

  @IsOptional()
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
}
