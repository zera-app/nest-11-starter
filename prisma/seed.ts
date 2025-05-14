import { prisma } from '@app/repositories';
import { seedPermission } from './seeders/permission.seed';
import { seedRole } from './seeders/role.seed';
import { seedUser } from './seeders/user.seed';

const seed = async () => {
  await seedPermission();
  await seedRole();
  await seedUser();
};

seed()
  .then(() => {
    console.log('Seeding completed');
  })
  .catch((error) => {
    console.error('Seeding failed', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
