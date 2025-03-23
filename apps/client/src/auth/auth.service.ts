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

@Injectable()
export class AuthService {
  constructor() {}

  async signIn(
    data: SignInDto,
  ): Promise<{ accessToken: string; user: UserInformation }> {
    const { email, password } = data;

    const userData = await UserModel().user.findUnique({
      where: {
        email,
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
      password,
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

    const accessToken = await AccessTokenModel().create(
      userData.id,
      StrUtils.random(100),
      !data.remember_me,
    );
    const userInformation = await UserModel().findUser(userData.id);

    return {
      accessToken: accessToken.token,
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
        emailVerification: undefined,
      },
    });

    await EmailVerificationModel().create(user.id);
  }

  async signOut(accessToken: string): Promise<void> {
    const token = await AccessTokenModel().findToken(accessToken);
    await AccessTokenModel().accessToken.delete({
      where: {
        id: token.id,
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
        emailVerification: {
          update: {
            usedAt: DateUtils.now().toString(),
          },
        },
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

    await EmailVerificationModel().create(userData.id);
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

    await ResetTokenModel().create(userData.id);
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
      },
      data: {
        expiresAt: DateUtils.now().toString(),
      },
    });
  }
}
