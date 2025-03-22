import { Prisma } from '@prisma/client';
import { prisma } from '.';

export function ResetTokenModel(tx?: Prisma.TransactionClient) {
  const db = tx || prisma;

  return {
    resetToken: db.resetToken,
  };
}
