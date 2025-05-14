import { prisma } from '@app/repositories';
import { Injectable } from '@nestjs/common';
import { ApplicationScope } from '@prisma/client';

@Injectable()
export class SelectOptionService {
  async selectRole(scope: ApplicationScope | null) {
    let where = {};
    if (scope) {
      where = {
        scope: scope,
      };
    }

    return await prisma.role.findMany({
      where: {
        ...where,
        NOT: {
          name: 'superuser',
        },
      },
      select: {
        id: true,
        name: true,
        scope: true,
      },
    });
  }
}
