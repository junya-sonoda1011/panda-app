import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';
import { SaveUserDto } from './dto/save-user.dto';
import { AuthDto } from './dto/auth.dto';
import { AuthCtrExceptionFilter } from '../..//utils/filters/auth-ctr-exception-filter';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseFilters(new AuthCtrExceptionFilter())
  async signup(
    @Body() saveUserDto: SaveUserDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.signup(saveUserDto);
  }

  @Post('login')
  @UseFilters(new AuthCtrExceptionFilter())
  async login(@Body() authDto: AuthDto) {
    return await this.authService.login(authDto);
  }
}
