import testOrmConfig from '../src/config/test_ormconfig';
import { createConnection } from 'typeorm';
import { truncateAll } from '../src/models/seed/truncate';

module.exports = async () => {
  const connection = await createConnection(testOrmConfig);
  await truncateAll(connection);
  await connection.close();
};
