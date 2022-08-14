import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from 'src/models/entities/user.entity';

import { UsersService } from 'src/modules/users/users.service';
import { CurrentUser } from 'src/utils/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/utils/guards/jwt-auth.guard';

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
  async findById(@Param('userId') userId: string) {
    const user = await this.usersService.findById(userId);

    if (user) return new UserResponse(user);
    throw new NotFoundException();
  }
}
