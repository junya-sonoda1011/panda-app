import testOrmConfig from '../src/config/test_ormconfig';
import { createConnection } from 'typeorm';
import { seed } from '../src/models/seed/seed';

module.exports = async () => {
  const connection = await createConnection(testOrmConfig);

  await seed(connection);

  await connection.close();
};
