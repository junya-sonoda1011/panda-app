import testOrmConfig from '../src/config/test_ormconfig';
import { createConnection } from 'typeorm';
import { BaseFactory } from '../src/models/factory/base.factory';
import { User } from '../src/models/entities/user.entity';
import { MealRecord } from '../src/models/entities/meal_record.entity';
import { RecordedSnack } from '../src/models/entities/recorded_snack.entity';
import { Snack } from '../src/models/entities/snack.entity';
import { truncateAll } from '../src/models/factory/truncate';

// export const truncateAll = async (connection) => {
//   console.log('User', User);

//   await BaseFactory.truncate(connection, MealRecord);
//   await BaseFactory.truncate(connection, User);
//   await BaseFactory.truncate(connection, RecordedSnack);
//   await BaseFactory.truncate(connection, Snack);
// };

module.exports = async () => {
  const connection = await createConnection(testOrmConfig);
  await truncateAll(connection);
  await connection.close();
};
