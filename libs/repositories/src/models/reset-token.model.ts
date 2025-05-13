import { Prisma } from '@prisma/client';
import { prisma } from '.';
import { DateUtils, StrUtils } from '@app/utils';
import { verificationTokenLifetime } from '@app/utils/default/token-lifetime';
import { NotFoundException } from '@nestjs/common';

export function ResetTokenModel(tx?: Prisma.TransactionClient) {
  const db = tx || prisma;

  return {
    resetToken: db.resetToken,

    async create(id: string): Promise<{ token: string }> {
      return db.resetToken.create({
        data: {
          userId: id,
          token: StrUtils.random(255),
          expiresAt: verificationTokenLifetime,
        },
      });
    },

    async findToken(token: string): Promise<{ userId: string }> {
      const resetToken = await db.resetToken.findFirst({
        where: { token },
      });

      if (!resetToken) {
        throw new NotFoundException('Token not found');
      }

      if (resetToken.expiresAt !== null) {
        if (DateUtils.isBefore(DateUtils.parse(resetToken.expiresAt.toString()), DateUtils.now())) {
          throw new NotFoundException('Token expired');
        }
      }

      return { userId: resetToken.userId };
    },
  };
}
