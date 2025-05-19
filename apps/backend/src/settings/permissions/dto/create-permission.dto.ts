import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreatePermissionDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 15)
  module: string;

  @IsNotEmpty()
  @IsString({ each: true })
  @Length(1, 50, { each: true })
  name: string[];
}
