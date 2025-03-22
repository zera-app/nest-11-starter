import { DateUtils } from '@app/utils';
import { HttpException, UnprocessableEntityException } from '@nestjs/common';
import { Response } from 'express';

export const errorResponse = (res: Response, error: any) => {
  const date = DateUtils.now().format('YYYY-MM-DD HH:mm:ss');

  console.log(`=============${date}==================`);
  console.error(error);
  console.log(`=======================================\n`);

  if (error instanceof HttpException) {
    if (error instanceof UnprocessableEntityException) {
      return res.status(422).json({
        code: 422,
        success: false,
        ...(error.getResponse() as Record<string, unknown>),
        data: null,
      });
    }

    const status = error.getStatus();
    const message = error.getResponse();

    if (message instanceof Object) {
      const msg = message as { message?: string; error?: string };
      return res.status(status).json({
        code: status,
        success: false,
        message: msg.message ?? msg.error,
        data: null,
      });
    }

    return res.status(status).json({
      code: status,
      success: false,
      message: message,
      data: null,
    });
  }

  return res.status(500).json({
    code: 500,
    success: false,
    message: 'Internal Server Error',
    data: null,
  });
};
