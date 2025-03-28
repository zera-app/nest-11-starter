import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { SignInDto } from './dtos/sign-in.dto';
import {
  AccessTokenModel,
  EmailVerificationModel,
  ResetTokenModel,
  UserInformation,
  UserModel,
} from '@app/repositories';
import { DateUtils, HashUtils, StrUtils } from '@app/utils';
import { SignUpDto } from './dtos/sign-up.dto';
import { VerifyDto } from './dtos/verify.dto';
import { ResendVerificationDto } from './dtos/resend-verification.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { MailService } from '@app/common';
import { EncryptionUtils } from '../../../../libs/utils/src/encryption/encryption.utils';

@Injectable()
export class AuthService {
  constructor(private readonly mailService: MailService) {}

  async signIn(
    data: SignInDto,
  ): Promise<{ accessToken: string; user: UserInformation }> {
    const userData = await UserModel().user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!userData) {
      throw new UnprocessableEntityException({
        message: 'Invalid email or password',
        error: {
          email: ['Invalid email or password'],
        },
      });
    }

    const isPasswordMatch = await HashUtils.compareHash(
      data.password,
      userData.password,
    );
    if (!isPasswordMatch) {
      throw new UnprocessableEntityException({
        message: 'Invalid email or password',
        error: {
          email: ['Invalid email or password'],
        },
      });
    }

    const token = StrUtils.random(100);
    await AccessTokenModel().create(userData.id, token, !data.remember_me);
    const userInformation = await UserModel().findUser(userData.id);

    return {
      accessToken: EncryptionUtils.encrypt(token),
      user: userInformation,
    };
  }

  async signUp(data: SignUpDto): Promise<void> {
    const { name, email, password, password_confirmation } = data;

    const isEmailExist = await UserModel().user.findUnique({
      where: {
        email,
      },
    });

    if (isEmailExist) {
      if (isEmailExist.emailVerifiedAt === null) {
        throw new UnprocessableEntityException({
          message: 'Email registered, please verify your email',
          error: {
            email: ['Email registered, please verify your email'],
          },
        });
      }

      throw new UnprocessableEntityException({
        message: 'Email already exist',
        error: {
          email: ['Email already exist'],
        },
      });
    }

    if (password !== password_confirmation) {
      throw new UnprocessableEntityException({
        message: 'Password not match',
        error: {
          password: ['Password not match'],
        },
      });
    }

    const user = await UserModel().user.create({
      data: {
        name,
        email,
        password: await HashUtils.generateHash(password),
      },
    });

    const emailVerification = await EmailVerificationModel().create(user.id);

    await this.mailService.sendMailWithTemplate(
      user.email,
      `Email Verification - ${process.env.APP_NAME}`,
      'auth/email-verification',
      {
        url: `${process.env.CLIENT_FRONTEND_APP_URL}/auth/verify-email?token=${emailVerification.token}`,
      },
    );
  }

  async signOut(accessToken: string, user: UserInformation): Promise<void> {
    if (!accessToken) {
      return;
    }

    const decryptedToken = EncryptionUtils.decrypt(accessToken.split(' ')[1]);
    const token = await AccessTokenModel().findToken(decryptedToken);
    await AccessTokenModel().accessToken.delete({
      where: {
        id: token.id,
        userId: user.id,
      },
    });
  }

  async verifyEmail(data: VerifyDto): Promise<void> {
    const { token } = data;

    const emailVerificationData =
      await EmailVerificationModel().findToken(token);
    const user = await UserModel().findUser(emailVerificationData.userId);

    await UserModel().user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerifiedAt: DateUtils.now().format(),
      },
    });

    await EmailVerificationModel().emailVerification.update({
      where: {
        userId: user.id,
        token: token,
      },
      data: {
        usedAt: DateUtils.now().format(),
      },
    });
  }

  async resendVerificationEmail(data: ResendVerificationDto): Promise<void> {
    const { email } = data;

    const userData = await UserModel().user.findUnique({
      where: {
        email,
      },
    });

    if (!userData) {
      return;
    }

    const emailVerification = await EmailVerificationModel().create(
      userData.id,
    );

    await this.mailService.sendMailWithTemplate(
      userData.email,
      `Email Verification - ${process.env.APP_NAME}`,
      'auth/email-verification',
      {
        url: `${process.env.CLIENT_FRONTEND_APP_URL}/auth/verify-email?token=${emailVerification.token}`,
      },
    );
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const { email } = data;
    const userData = await UserModel().user.findUnique({
      where: {
        email,
      },
    });

    if (!userData) {
      return;
    }

    const token = await ResetTokenModel().create(userData.id);
    await this.mailService.sendMailWithTemplate(
      userData.email,
      `Password Reset - ${process.env.APP_NAME}`,
      'auth/forgot-password',
      {
        url: `${process.env.CLIENT_FRONTEND_APP_URL}/auth/reset-password?token=${token.token}`,
      },
    );
  }

  async resetPassword(data: ResetPasswordDto) {
    const { token, password, password_confirmation } = data;

    const resetTokenData = await ResetTokenModel().findToken(token);
    const user = await UserModel().findUser(resetTokenData.userId);
    if (password !== password_confirmation) {
      throw new UnprocessableEntityException({
        message: 'Password not match',
        error: {
          password: ['Password not match'],
        },
      });
    }

    await UserModel().user.update({
      where: {
        id: user.id,
      },
      data: {
        password: await HashUtils.generateHash(password),
      },
    });

    await ResetTokenModel().resetToken.update({
      where: {
        userId: user.id,
        token: token,
      },
      data: {
        usedAt: DateUtils.now().format(),
      },
    });
  }
}
