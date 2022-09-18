import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class CommonExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    console.log(request.url);

    if (exception instanceof UnauthorizedException) {
      const res = new UnauthorizedException('ログインしてください');
      response.status(status).json({
        status: status,
        message: res.message,
        error: res.name,
      });
    }

    if (exception instanceof InternalServerErrorException) {
      const res = new InternalServerErrorException(
        '開発者へ問い合わせてください',
      );

      response.status(status).json({
        status: status,
        message: res.message,
        error: res.name,
      });
    }
  }
}
