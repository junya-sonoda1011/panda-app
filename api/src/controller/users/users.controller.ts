import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
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

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  @UseFilters(new UsersCtrExceptionFilter())
  async findById(@Param('userId') userId: string) {
    const user = await this.usersService.findById(userId);
    if (user) return new UserResponse(user);
  }
}
