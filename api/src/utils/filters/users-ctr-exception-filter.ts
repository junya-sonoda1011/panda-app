import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { classValidatorMessages } from '../validators/class-validator-messages';

@Catch(
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
)
export class UsersCtrExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (exception instanceof UnauthorizedException)
      response
        .status(status)
        .json(new UnauthorizedException('ログインしてください').getResponse());
    else if (exception instanceof NotFoundException)
      response
        .status(status)
        .json(
          new NotFoundException(
            '指定されたID のユーザーが存在しません',
          ).getResponse(),
        );
    else if (exception instanceof BadRequestException) {
      const { isNotExist } = classValidatorMessages;

      const isNotExistMessage = isNotExist(exception.getResponse()['message']);

      response
        .status(status)
        .json(
          isNotExistMessage
            ? new BadRequestException(isNotExistMessage).getResponse()
            : exception.getResponse(),
        );
    } else if (exception instanceof InternalServerErrorException)
      response
        .status(status)
        .json(
          new InternalServerErrorException(
            '開発者へ問い合わせてください',
          ).getResponse(),
        );
  }
}
