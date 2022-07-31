import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { User } from 'src/models/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service';
import { SaveUserDto } from './dto/save-user.dto';
import { UserResponse } from './response/find-user.response';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() body: SaveUserDto): Promise<string> {
    await this.usersService.save(body);
    return 'ユーザー情報が登録されました';
  }

  @Get(':userId')
  async findById(@Param('userId') userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      return new NotFoundException();
    }
    return new UserResponse(user);
  }
}
