import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SaveUserDto } from '../../controller/auth/dto/save-user.dto';
import { User } from '../../models/entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../../controller/users/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
  ) {}

  async save(saveUserDto: SaveUserDto): Promise<User> {
    try {
      saveUserDto.password = await bcrypt.hash(
        saveUserDto.password,
        await bcrypt.genSalt(),
      );
      const saveData = new UserData4Save(saveUserDto);
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

  async findById(userId: string): Promise<User> {
    try {
      const user = await this.user.findOne({ where: { id: userId } });
      if (user) return user;
    } catch (error) {
      throw new InternalServerErrorException();
    }
    throw new NotFoundException();
  }

  async updateCurrentUser(
    user: User,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      if (updateUserDto.password)
        updateUserDto.password = await bcrypt.hash(
          updateUserDto.password,
          await bcrypt.genSalt(),
        );
      if (user) {
        const updateUser = new UserData4Save(updateUserDto, user);
        return await this.user.save(updateUser.user);
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
    throw new NotFoundException();
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      if (updateUserDto.password)
        updateUserDto.password = await bcrypt.hash(
          updateUserDto.password,
          await bcrypt.genSalt(),
        );
      const user = await this.user.findOne({ where: { id: userId } });
      if (user) {
        const updateUser = new UserData4Save(updateUserDto, user);
        return await this.user.save(updateUser.user);
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
    throw new NotFoundException();
  }

  async deleteCurrentUser(user: User): Promise<DeleteResult> {
    try {
      const deleteUser = await this.user.findOne({ where: { id: user.id } });
      if (deleteUser) return await this.user.delete(deleteUser.id);
    } catch (error) {
      throw new InternalServerErrorException();
    }
    throw new NotFoundException();
  }

  async delete(userId: string): Promise<DeleteResult> {
    try {
      const deleteUser = await this.user.findOne({ where: { id: userId } });

      if (deleteUser) return await this.user.delete({ id: userId });
    } catch (error) {
      throw new InternalServerErrorException();
    }
    throw new NotFoundException();
  }
}

class UserData4Save {
  user: User;

  constructor(data: SaveUserDto | UpdateUserDto, user?: User) {
    this.user = Object.assign(new User(), { ...user });
    this.user.name = data?.name;
    this.user.work = data?.work;
    this.user.hobby = data?.hobby;
    this.user.password = data?.password;
  }
}
