import { OmitType } from '@nestjs/mapped-types';
import { CreatePermissionDto } from './create-permission.dto';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdatePermissionDto extends OmitType(CreatePermissionDto, ['name']) {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  name: string;
}
