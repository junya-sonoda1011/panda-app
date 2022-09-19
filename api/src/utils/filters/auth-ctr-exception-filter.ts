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
      const regex = /should not exist/;
      const message = exception.getResponse()['message'];

      // property $property should not exist と一致するメッセージが含まれるか確認する
      const foundMessage = message.find((m) => m.match(regex));
      if (foundMessage) {
        // 日本語に変換する
        message[message.indexOf(foundMessage)] = foundMessage
          .replace(regex, 'という項目は存在しません')
          .slice(9, foundMessage.length);
        response
          .status(status)
          .json(new BadRequestException(message).getResponse());
      } else response.status(status).json(exception.getResponse());
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
