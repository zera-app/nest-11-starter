import { prisma } from '@app/repositories';

export function seedRole() {
  const roleNames = ['superuser', 'admin', 'user'];
  roleNames.map((name) => {
    prisma.role.create({
      data: {
        name,
      },
    });
  });
}
