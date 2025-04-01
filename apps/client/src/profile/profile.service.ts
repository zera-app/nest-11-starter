import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { updateProfileDto } from './dtos/update-profile.dto';
import {
  EmailVerificationModel,
  prisma,
  UserInformation,
  UserModel,
} from '@app/repositories';
import { MailService } from '@app/common';
import { UpdatePasswordDto } from './update-password.dto';
import { HashUtils } from '@app/utils';

@Injectable()
export class ProfileService {
  constructor(private readonly mailService: MailService) {}

  async updateProfile(
    user: UserInformation,
    body: updateProfileDto,
  ): Promise<UserInformation> {
    const data = prisma.$transaction(async (tx) => {
      await UserModel(tx).user.update({
        where: { id: user.id },
        data: {
          name: body.name,
          email: body.email,
          emailVerifiedAt: user.email === body.email ? undefined : null,
        },
      });

      if (user.email !== body.email) {
        const token = await EmailVerificationModel(tx).create(user.id);
        this.mailService.sendMailWithTemplate(
          body.email,
          'Email verification',
          'auth/email-verification',
          {
            url: `${process.env.CLIENT_FRONTEND_APP_URL}/verify-email?token=${token.token}`,
          },
        );
      }

      return {
        id: user.id,
        name: body.name,
        email: body.email,
        emailVerifiedAt: user.email === body.email ? undefined : null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });

    return data;
  }

  async updatePassword(
    user: UserInformation,
    body: UpdatePasswordDto,
  ): Promise<UserInformation> {
    if (body.confirmPassword !== body.newPassword) {
      throw new UnprocessableEntityException({
        message: 'Password does not match',
        errors: {
          confirmPassword: ['Password does not match'],
        },
      });
    }

    const isMatch = await UserModel(prisma).checkPassword(
      user.id,
      body.currentPassword,
    );

    if (!isMatch) {
      throw new UnprocessableEntityException({
        message: 'Current password is incorrect',
        errors: {
          currentPassword: ['Current password is incorrect'],
        },
      });
    }

    const data = await UserModel(prisma).user.update({
      where: { id: user.id },
      data: {
        password: await HashUtils.generateHash(body.newPassword),
      },
    });

    return data;
  }
}
