import { Prisma } from '@prisma/client';
import { prisma } from '.';

export function EmailVerificationModel(tx?: Prisma.TransactionClient) {
  const db = tx || prisma;

  return {
    emailVerification: db.emailVerification,
  };
}
