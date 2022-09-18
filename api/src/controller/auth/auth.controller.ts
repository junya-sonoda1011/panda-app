import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';
import { SaveUserDto } from './dto/save-user.dto';
import { AuthDto } from './dto/auth.dto';
import { CommonExceptionFilter } from 'src/utils/filters/common-exception-filter';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseFilters(CommonExceptionFilter)
  async signup(@Body() saveUSerDto: SaveUserDto) {
    return await this.authService.signUp(saveUSerDto);
  }

  @Post('login')
  async login(@Body() authDto: AuthDto) {
    try {
      return await this.authService.login(authDto);
    } catch (e) {
      console.log(e instanceof UnauthorizedException);

      if (e instanceof UnauthorizedException) {
        throw new UnauthorizedException(
          'ユーザー名またはパスワードを確認してください',
        );
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
