import { User } from '../entities/user.entity';
import { UserFactory } from '../factory/user.factory';
import { truncateAll } from './truncate';
import * as bcrypt from 'bcrypt';

const saveUser = [
  {
    password: 'test1234',
  },
  {
    password: 'test4321',
  },
  {
    password: 'test2341',
  },
];

export const seed = async (connection) => {
  await truncateAll(connection);

  saveUser[0].password = await bcrypt.hash(
    saveUser[0].password,
    await bcrypt.genSalt(),
  );

  await UserFactory.createMany(connection, User, saveUser);
};
