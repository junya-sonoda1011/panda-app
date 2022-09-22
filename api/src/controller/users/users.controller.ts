import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Put,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersCtrExceptionFilter } from '../../utils/filters/users-ctr-exception-filter';
import { User } from '../../models/entities/user.entity';

import { UsersService } from '../../modules/users/users.service';
import { CurrentUser } from '../../utils/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../utils/guards/jwt-auth.guard';

import { UserResponse } from './response/find-user.response';
import { SaveUserDto } from '../auth/dto/save-user.dto';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @UseFilters(UsersCtrExceptionFilter)
  async findCurrentUser(
    @CurrentUser() currentUser: User,
  ): Promise<UserResponse> {
    if (currentUser) return new UserResponse(currentUser);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseFilters(new UsersCtrExceptionFilter())
  async find(): Promise<UserResponse[]> {
    const users = await this.usersService.find();
    if (users) return users.map((u) => new UserResponse(u));
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  @UseFilters(new UsersCtrExceptionFilter())
  async findById(@Param('userId') userId: string): Promise<UserResponse> {
    const user = await this.usersService.findById(userId);
    if (user) return new UserResponse(user);
  }

  @Put(':userId')
  @UseGuards(JwtAuthGuard)
  @UseFilters(new UsersCtrExceptionFilter())
  async update(
    @Param('userId') userId: string,
    @Body() saveUserDto: SaveUserDto,
  ): Promise<{ message: string }> {
    await this.usersService.update(userId, saveUserDto);
    return { message: 'ユーザー情報を更新しました' };
  }
}
