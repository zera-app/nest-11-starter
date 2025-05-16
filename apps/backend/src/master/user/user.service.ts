import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { prisma, UserModel } from '@app/repositories';
import { DateUtils } from '@app/utils';
import { DatatableType, PaginationResponse } from '@app/common';

@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto): Promise<{
    id: string;
    name: string | null;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }> {
    if (createUserDto.password !== createUserDto.password_confirmation) {
      throw new UnprocessableEntityException({
        message: 'Password and password confirmation do not match',
        error: {
          password_confirmation: ['Password and password confirmation do not match'],
        },
      });
    }

    const data = await prisma.$transaction(async (prisma) => {
      const user = await UserModel(prisma).create(
        {
          name: createUserDto.name,
          email: createUserDto.email,
          password: createUserDto.password,
          emailVerifiedAt: DateUtils.now().toDate(),
        },
        createUserDto.roleIds,
      );

      return user;
    });

    return data;
  }

  async findAll(queryParam: DatatableType): Promise<
    PaginationResponse<{
      id: string;
      name: string | null;
      email: string;
      createdAt: Date;
      updatedAt: Date;
    }>
  > {
    return await UserModel().findAll(queryParam);
  }

  async findOne(id: string): Promise<{
    id: string;
    name: string | null;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }> {
    return await UserModel().findOne(id);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<{
    id: string;
    name: string | null;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }> {
    if (updateUserDto.password && updateUserDto.password !== updateUserDto.password_confirmation) {
      throw new UnprocessableEntityException({
        message: 'Password and password confirmation do not match',
        error: {
          password_confirmation: ['Password and password confirmation do not match'],
        },
      });
    }

    const data = await prisma.$transaction(async (prisma) => {
      const user = await UserModel(prisma).update(
        id,
        {
          name: updateUserDto.name,
          email: updateUserDto.email,
          password: updateUserDto.password,
        },
        updateUserDto.roleIds,
      );

      return user;
    });

    if (!data) {
      throw new NotFoundException({
        message: 'User not found',
        error: {
          user: ['User not found'],
        },
      });
    }

    return data;
  }

  async remove(id: string): Promise<void> {
    await UserModel().remove(id);
  }
}
