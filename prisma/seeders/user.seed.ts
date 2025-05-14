import { prisma } from '@app/repositories';
import { HashUtils } from '@app/utils';

export async function seedUser() {
  const roleNames = ['superuser', 'admin', 'user'];

  roleNames.map(async (name) => {
    const user = await prisma.user.create({
      data: {
        name,
        email: `${name}@zera.com`,
        password: await HashUtils.generateHash('password'),
      },
    });

    const role = await prisma.role.findFirst({
      where: {
        name,
      },
    });

    if (role) {
      await prisma.roleUser.create({
        data: {
          userId: user.id,
          roleId: role.id,
        },
      });
    }
  });
}
