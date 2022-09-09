import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveUserDto } from '../../controller/users/dto/save-user.dto';
import { User } from '../../models/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
  ) {}

  async save(body: SaveUserDto): Promise<User> {
    body.password = await bcrypt.hash(body.password, await bcrypt.genSalt());
    const saveData = new UserData4Save(body);
    return await this.user.save(saveData);
  }

  async findById(userId: string): Promise<User> {
    return await this.user.findOne({ where: { id: userId } });
  }

  async findByName(userName: string): Promise<User> {
    return await this.user.findOne({ where: { name: userName } });
  }

  async findByPayload(payload: {
    id: string;
    username: string;
  }): Promise<User> {
    return await this.user.findOne({
      where: { id: payload.id, name: payload.username },
    });
  }
}

class UserData4Save {
  name: string;
  work: string;
  hobby: string;
  password: string;
  createdAt: string;
  updatedAt: string;

  constructor(data: SaveUserDto) {
    this.name = data.name;
    this.work = data.work;
    this.hobby = data.hobby;
    this.password = data.password;
  }
}
