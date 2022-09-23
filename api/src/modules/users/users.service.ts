import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveUserDto } from '../../controller/auth/dto/save-user.dto';
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
    try {
      body.password = await bcrypt.hash(body.password, await bcrypt.genSalt());
      const saveData = new UserData4Save(body);
      return await this.user.save(saveData.user);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async find(): Promise<User[]> {
    try {
      const users = await this.user.find();
      if (users) return users;
    } catch (error) {
      throw new InternalServerErrorException();
    }
    throw new NotFoundException();
  }

  async findById(userId: string): Promise<User> {
    try {
      const user = await this.user.findOne({ where: { id: userId } });
      if (user) return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
    throw new NotFoundException();
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

  async update(userId: string, body: SaveUserDto): Promise<User> {
    try {
      body.password = await bcrypt.hash(body.password, await bcrypt.genSalt());
      const user = await this.user.findOne({ where: { id: userId } });
      if (user) {
        const updateUser = new UserData4Save(body, user);
        return await this.user.save(updateUser.user);
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
    throw new NotFoundException();
  }
}

class UserData4Save {
  user: User;

  constructor(data: SaveUserDto, user?: User) {
    this.user = Object.assign(new User(), { ...user });
    this.user.name = data?.name;
    this.user.work = data?.work;
    this.user.hobby = data?.hobby;
    this.user.password = data?.password;
  }
}
