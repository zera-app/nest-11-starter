import { Prisma } from '@prisma/client';
import { prisma } from '.';
import { DateUtils, StrUtils } from '@app/utils';
import { verificationTokenLifetime } from '@app/utils/default/token-lifetime';
import { NotFoundException } from '@nestjs/common';

export function EmailVerificationModel(tx?: Prisma.TransactionClient) {
  const db = tx || prisma;

  return {
    emailVerification: db.emailVerification,

    async create(id: string): Promise<{ token: string }> {
      return db.emailVerification.create({
        data: {
          userId: id,
          token: StrUtils.random(255),
          expiresAt: verificationTokenLifetime,
        },
      });
    },

    async findToken(token: string): Promise<{ userId: string }> {
      const emailVerification = await db.emailVerification.findFirst({
        where: { token },
      });

      if (!emailVerification) {
        throw new NotFoundException('Token not found');
      }

      if (emailVerification.expiresAt !== null) {
        if (DateUtils.isBefore(DateUtils.parse(emailVerification.expiresAt.toString()), DateUtils.now())) {
          throw new NotFoundException('Token expired');
        }
      }

      return { userId: emailVerification.userId };
    },
  };
}
