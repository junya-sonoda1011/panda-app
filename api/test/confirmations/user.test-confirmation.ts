import { SaveUserDto } from '../../src/controller/auth/dto/save-user.dto';
import { Connection } from 'typeorm';
import { User } from '../../src/models/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../../src/controller/users/dto/update-user.dto';

export class UserTestConfirmation {
  static async confirmSave(
    connection: Connection,
    data: SaveUserDto | UpdateUserDto,
    userId?: string,
  ): Promise<void> {
    if (userId) expect(userId).toBeDefined();

    const userRepository = connection.getRepository(User);
    const savedUser = userId
      ? await userRepository.findOne({ where: { id: userId } })
      : await userRepository.findOne({ where: { name: data.name } });

    if (data.name) expect(data.name).toEqual(savedUser.name);

    if (data.work) await expect(data.work).toEqual(savedUser?.work);

    if (data.hobby) expect(data.hobby).toEqual(savedUser.hobby);
    if (data.password)
      expect(await bcrypt.compare(data.password, savedUser.password)).toEqual(
        true,
      );
  }

  static async confirmDelete(
    connection: Connection,
    userId: string,
  ): Promise<void> {
    if (userId) expect(userId).toBeDefined();

    const userRepository = connection.getRepository(User);

    const deletedUser = await userRepository.findOne({
      where: { id: userId },
    });
    expect(deletedUser).toEqual(undefined);
  }
}
