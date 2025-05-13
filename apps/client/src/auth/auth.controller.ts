import { Body, Controller, Headers, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/sign-up.dto';
import { VerifyDto } from './dtos/verify.dto';
import { ResendVerificationDto } from './dtos/resend-verification.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { Response } from 'express';
import { CurrentUser, errorResponse, successResponse } from '@app/common';
import { AuthGuard } from '@app/common/guards/auth.guard';
import { UserInformation } from '@app/repositories';
import { SignInDto } from './dtos/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(@Body() body: SignInDto, @Res() res: Response): Promise<Response> {
    try {
      const response = await this.authService.signIn(body);
      return res.status(200).json(successResponse(200, 'User signed in successfully', response));
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  @Post('sign-up')
  async signUp(@Body() body: SignUpDto, @Res() res: Response): Promise<Response> {
    try {
      await this.authService.signUp(body);
      return res.json(successResponse(201, 'User registered successfully. A verification email has been sent to your address', null));
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  @Post('sign-out')
  @UseGuards(AuthGuard)
  async signOut(@Res() res: Response, @CurrentUser() user: UserInformation, @Headers('Authorization') authHeader: string): Promise<Response> {
    try {
      await this.authService.signOut(authHeader, user);
      return res.status(200).json(successResponse(200, 'User signed out successfully', null));
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  @Post('verify-email')
  async verifyEmail(@Body() body: VerifyDto, @Res() res: Response): Promise<Response> {
    try {
      await this.authService.verifyEmail(body);
      return res.status(200).json(successResponse(200, 'Email verified successfully', null));
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  @Post('resend-verification')
  async resendVerification(@Body() body: ResendVerificationDto, @Res() res: Response): Promise<Response> {
    try {
      await this.authService.resendVerificationEmail(body);
      return res.status(200).json(successResponse(200, 'Verification email sent successfully', null));
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto, @Res() res: Response) {
    try {
      await this.authService.forgotPassword(body);
      return res.status(200).json(successResponse(200, 'Password reset email sent successfully', null));
    } catch (error) {
      return errorResponse(res, error);
    }
  }

  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto, @Res() res: Response) {
    try {
      await this.authService.resetPassword(body);
      return res.status(200).json(successResponse(200, 'Password reset successfully', null));
    } catch (error) {
      return errorResponse(res, error);
    }
  }
}
