import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from '../../controller/auth/dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(body): Promise<{ accessToken: string }> {
    const user = await this.usersService.save(body);
    if (user) {
      try {
        const payload = { id: user.id, userName: user.name };
        const accessToken = await this.jwtService.sign(payload);
        return { accessToken };
      } catch (error) {
        throw new InternalServerErrorException();
      }
    }
  }

  async login(authDto: AuthDto): Promise<{ accessToken: string }> {
    const user = await this.usersService.findByName(authDto.name);

    if (user && (await bcrypt.compare(authDto.password, user.password))) {
      try {
        const payload = { username: user.name, id: user.id };
        const accessToken = await this.jwtService.sign(payload);
        return { accessToken };
      } catch (error) {
        throw new InternalServerErrorException();
      }
    }
    throw new UnauthorizedException();
  }
}
