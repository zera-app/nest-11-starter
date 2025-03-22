import { Prisma } from '@prisma/client';
import { prisma } from '.';

export function UserModel(tx?: Prisma.TransactionClient) {
  const db = tx || prisma;

  return {
    user: db.user,
  };
}
