import { NextApiRequest, NextApiResponse } from 'next';
import { HttpException } from 'next-api-decorators';
import { ERROR_MESSAGES } from '@/utils/constants/common';

export const exceptionHandler = (
  error: HttpException,
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  console.error({ req, error });
  res.status(error instanceof HttpException ? error.statusCode : 500).json({
    message:
      !(error instanceof HttpException) && process.env.NODE_ENV !== 'development'
        ? ERROR_MESSAGES.somethingWentWrong
        : error.message,
  });
};
