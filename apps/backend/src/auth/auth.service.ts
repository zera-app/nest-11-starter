import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import {
  AccessTokenModel,
  UserInformation,
  UserModel,
} from '@app/repositories';
import { EncryptionUtils, HashUtils, StrUtils } from '@app/utils';

@Injectable()
export class AuthService {
  async signIn(body: SignInDto): Promise<{
    accessToken: string;
    user: UserInformation;
  }> {
    const UserData = await UserModel().user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!UserData) {
      throw new UnprocessableEntityException({
        message: 'Invalid email or password',
        error: {
          email: ['Invalid email or password'],
        },
      });
    }

    const isPasswordMatch = await HashUtils.compareHash(
      body.password,
      UserData.password,
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
    await AccessTokenModel().create(UserData.id, token, body.remember_me);
    const userInformation = await UserModel().findUser(UserData.id);

    return {
      accessToken: EncryptionUtils.encrypt(token),
      user: userInformation,
    };
  }

  async signOut(authHeader: string, user: UserInformation): Promise<void> {
    const token = authHeader.split(' ')[1];
    const decryptedToken = EncryptionUtils.decrypt(token);

    await AccessTokenModel().accessToken.deleteMany({
      where: {
        token: decryptedToken,
        userId: user.id,
      },
    });
  }
}
