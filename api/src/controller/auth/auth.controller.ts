import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';
import { SaveUserDto } from '../users/dto/save-user.dto';
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
    return await this.authService.login(authDto);
  }
}
