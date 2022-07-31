import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/models/entities/user.entity';
import { UsersService } from 'src/modules/users/users.service.module';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() body: CreateUserDto): Promise<User> {
    return await this.usersService.create(body);
  }
}
