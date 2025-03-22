import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class AppController {
  @Get()
  getHello(@Res() res: Response): Response {
    return res.json({
      message: 'Welcome to the backend service',
      app_env: process.env.APP_ENV,
    });
  }
}
