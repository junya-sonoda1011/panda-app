import { MealRecord } from '../entities/meal_record.entity';
import { RecordedSnack } from '../entities/recorded_snack.entity';
import { Snack } from '../entities/snack.entity';
import { User } from '../entities/user.entity';
import { BaseFactory } from '../factory/base.factory';

export const truncateAll = async (connection) => {
  await BaseFactory.truncate(connection, MealRecord);
  await BaseFactory.truncate(connection, User);
  await BaseFactory.truncate(connection, RecordedSnack);
  await BaseFactory.truncate(connection, Snack);
};
