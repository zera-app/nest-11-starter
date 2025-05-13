import { CurrentUser, errorResponse, successResponse } from '@app/common';
import { AuthGuard } from '@app/common/guards/auth.guard';
import { UserInformation } from '@app/repositories';
import { Body, Controller, Get, Put, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { updateProfileDto } from './dtos/update-profile.dto';
import { ProfileService } from './profile.service';
import { UpdatePasswordDto } from './update-password.dto';

@Controller('profile')
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  getProfile(@CurrentUser() user: UserInformation, @Res() response: Response) {
    return response.status(200).json(successResponse(200, 'User profile', user));
  }

  @Put()
  async updateProfile(@CurrentUser() user: UserInformation, @Res() response: Response, @Body() body: updateProfileDto) {
    try {
      const data = await this.profileService.updateProfile(user, body);
      return response.status(200).json(successResponse(200, 'Profile updated', data));
    } catch (error) {
      return errorResponse(response, error);
    }
  }

  @Put('password')
  updatePassword(@CurrentUser() user: UserInformation, @Res() response: Response, @Body() body: UpdatePasswordDto) {
    try {
      const data = this.profileService.updatePassword(user, body);
      return response.status(200).json(successResponse(200, 'Password updated', data));
    } catch (error) {
      return errorResponse(response, error);
    }
  }
}
