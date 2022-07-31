import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/controller/users/dto/create-user.dto';
import { User } from 'src/models/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>
  ) {}

  async create(body: CreateUserDto): Promise<User> {
    const { name, work, hobby } = body;
    const saveUser = await this.user.create({
      name,
      work,
      hobby,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return await this.user.save(saveUser);
  }
}
