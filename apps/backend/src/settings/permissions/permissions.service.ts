import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionModel, prisma } from '@app/repositories';
import { DatatableType, PaginationResponse } from '@app/common';

@Injectable()
export class PermissionsService {
  async create(createPermissionDto: CreatePermissionDto): Promise<{ id: string; name: string; module: string }[]> {
    const data = await prisma.$transaction(async (prisma) => {
      const permissions = createPermissionDto.name.map((name) => {
        return {
          name,
          module: createPermissionDto.module,
        };
      });

      const existingPermissions = await prisma.permission.findMany({
        where: {
          module: createPermissionDto.module,
          name: {
            in: createPermissionDto.name,
          },
        },
      });

      if (existingPermissions.length > 0) {
        const existingPermissionNames = existingPermissions.map((p) => p.name).join(', ');
        throw new UnprocessableEntityException({
          message: `Permissions already exist for module ${createPermissionDto.module}: ${existingPermissionNames}`,
          errors: {
            name: [`Permissions already exist: ${existingPermissionNames}`],
          },
        });
      }

      const permission = await prisma.permission.createMany({
        data: permissions,
      });

      if (!permission) {
        throw new UnprocessableEntityException({
          message: `Failed to create permissions for module ${createPermissionDto.module}`,
          errors: {
            name: [`Failed to create permissions for module ${createPermissionDto.module}`],
          },
        });
      }
      const createdPermissions = await prisma.permission.findMany({
        where: {
          module: createPermissionDto.module,
          name: {
            in: createPermissionDto.name,
          },
        },
        orderBy: {
          name: 'asc',
        },
      });

      return createdPermissions;
    });

    return data;
  }

  async findAll(query: DatatableType): Promise<PaginationResponse<{ id: string; name: string; module: string }>> {
    return await PermissionModel().findAll(query);
  }

  async findOne(id: string): Promise<{ id: string; name: string; module: string; createdAt: Date; updatedAt: Date }> {
    const data = await prisma.permission.findUnique({
      where: {
        id,
      },
    });

    if (!data) {
      throw new NotFoundException(`Permission with id ${id} not found`);
    }

    return data;
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    const permissionExist = await prisma.permission.findUnique({
      where: {
        id,
      },
    });

    if (!permissionExist) {
      throw new NotFoundException(`Permission with id ${id} not found`);
    }

    const existingPermission = await prisma.permission.findUnique({
      where: {
        NOT: {
          id,
        },
        name: updatePermissionDto.name,
        module: updatePermissionDto.module,
      },
    });

    if (existingPermission) {
      throw new UnprocessableEntityException({
        message: `Permission already exists for module ${updatePermissionDto.module}: ${updatePermissionDto.name}`,
        errors: {
          name: [`Permission already exists: ${updatePermissionDto.name}`],
        },
      });
    }

    const data = await prisma.$transaction(async (prisma) => {
      const permission = await prisma.permission.update({
        where: {
          id,
        },
        data: {
          ...updatePermissionDto,
        },
      });

      return permission;
    });

    return data;
  }

  async remove(id: string): Promise<void> {
    const permissionExist = await prisma.permission.findUnique({
      where: {
        id,
      },
    });

    if (!permissionExist) {
      throw new NotFoundException(`Permission with id ${id} not found`);
    }

    await prisma.$transaction(async (prisma) => {
      const permission = await prisma.permission.delete({
        where: {
          id,
        },
      });

      return permission;
    });
  }
}
