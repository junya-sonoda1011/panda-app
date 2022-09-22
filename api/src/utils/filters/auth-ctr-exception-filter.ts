import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { classValidatorMessages } from '../validators/class-validator-messages';

@Catch(UnauthorizedException, BadRequestException, InternalServerErrorException)
export class AuthCtrExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (exception instanceof UnauthorizedException)
      response
        .status(status)
        .json(
          new UnauthorizedException(
            'ユーザー名またはパスワードを確認してください',
          ).getResponse(),
        );
    else if (BadRequestException) {
      const { isNotExist } = classValidatorMessages;

      const isNotExistMessage = isNotExist(exception.getResponse()['message']);

      response
        .status(status)
        .json(
          isNotExistMessage
            ? new BadRequestException(isNotExistMessage).getResponse()
            : exception.getResponse(),
        );
    } else if (InternalServerErrorException)
      response
        .status(status)
        .json(
          new InternalServerErrorException(
            '開発者へ問い合わせてください',
          ).getResponse(),
        );
  }
}
