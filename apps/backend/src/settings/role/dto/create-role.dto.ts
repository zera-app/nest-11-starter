import { ApplicationScope } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEnum(ApplicationScope)
  scope: ApplicationScope;

  @IsNotEmpty()
  @IsString({ each: true })
  @IsUUID('4', { each: true })
  permissionIds: string[];
}
