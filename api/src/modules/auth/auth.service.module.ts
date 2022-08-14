import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/entities/user.entity';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.service.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';

const env = process.env.NODE_ENV || 'dev';
const dotenv_path = path.resolve(process.cwd(), `.${env}.env`);
const result = dotenv.config({ path: dotenv_path });
if (result.error) {
  /* do nothing */
}

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRETKEY,
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  providers: [AuthService, UsersService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService, UsersService, JwtStrategy, JwtAuthGuard],
})
export class AuthModule {}
