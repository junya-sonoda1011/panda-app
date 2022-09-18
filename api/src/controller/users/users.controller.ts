import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommonExceptionFilter } from '../../utils/filters/common-exception-filter';
import { User } from '../../models/entities/user.entity';

import { UsersService } from '../../modules/users/users.service';
import { CurrentUser } from '../../utils/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../utils/guards/jwt-auth.guard';

import { UserResponse } from './response/find-user.response';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async findCurrentUser(
    @CurrentUser() currentUser: User,
  ): Promise<UserResponse> {
    if (currentUser) return new UserResponse(currentUser);
    throw new NotFoundException();
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  @UseFilters(CommonExceptionFilter)
  async findById(@Param('userId') userId: string) {
    try {
      const user = await this.usersService.findById(userId);
      if (user) return new UserResponse(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('ユーザーID が見つかりません');
      } else {
        throw new InternalServerErrorException('開発者へ問い合わせてください');
      }
    }
  }
}
