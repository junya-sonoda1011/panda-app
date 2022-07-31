import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveUserDto } from 'src/controller/users/dto/save-user.dto';
import { User } from 'src/models/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
  ) {}

  async save(body: SaveUserDto): Promise<void> {
    const saveData = new UserData4Save(body);
    await this.user.save(saveData);
  }

  async findById(userId: string): Promise<User> {
    const user = await this.user.findOne({ where: { id: userId } });
    return user;
  }
}

export class UserData4Save {
  name: string;
  work: string;
  hobby: string;
  createdAt: string;
  updatedAt: string;

  constructor(data: SaveUserDto) {
    this.name = data.name;
    this.work = data.work;
    this.hobby = data.hobby;
  }
}
