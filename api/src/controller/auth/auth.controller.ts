import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';
import { SaveUserDto } from './dto/save-user.dto';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
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
