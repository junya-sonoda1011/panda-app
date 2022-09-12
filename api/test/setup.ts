import testOrmConfig from '../src/config/test_ormconfig';
import { createConnection } from 'typeorm';
import { UserFactory } from '../src/models/factory/user.factory';
import { User } from '../src/models/entities/user.entity';
import { truncateAll } from '../src/models/factory/truncate';
import * as bcrypt from 'bcrypt';

const saveUser = [
  {
    name: 'testUser',
    password: 'test1234',
  },
];

module.exports = async () => {
  saveUser[0].password = await bcrypt.hash(
    saveUser[0].password,
    await bcrypt.genSalt(),
  );
  const connection = await createConnection(testOrmConfig);

  await truncateAll(connection);
  await UserFactory.createMany(connection, User, saveUser);

  await connection.close();
};
