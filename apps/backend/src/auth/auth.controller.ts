import {
  Body,
  Controller,
  Headers,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser, errorResponse, successResponse } from '@app/common';
import { Response } from 'express';
import { SignInDto } from './dto/sign-in.dto';
import { AuthGuard } from '@app/common/guards/auth.guard';
import { UserInformation } from '@app/repositories';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(
    @Body() body: SignInDto,
    @Res() res: Response,
  ): Promise<Response> {
    try {
      const response = await this.authService.signIn(body);
      return res
        .status(200)
        .json(successResponse(200, 'User signed in successfully', response));
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  @Post('sign-out')
  @UseGuards(AuthGuard)
  async signOut(
    @Res() res: Response,
    @CurrentUser() user: UserInformation,
    @Headers('Authorization') authHeader: string,
  ): Promise<Response> {
    try {
      await this.authService.signOut(authHeader, user);
      return res
        .status(200)
        .json(successResponse(200, 'User signed out successfully', null));
    } catch (error) {
      return errorResponse(res, error);
    }
  }
}
