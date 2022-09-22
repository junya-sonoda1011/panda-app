import { ConnectionOptions } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { entities } from '../models/entities/entities';

const env = process.env.ENV || 'dev';
const dotenv_path = path.resolve(process.cwd(), `.${env}.env`);
const result = dotenv.config({ path: dotenv_path });
if (result.error) {
  /* do nothing */
}

export const testOrmConfig: ConnectionOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  password: process.env.DATABASE_PASSWORD,
  username: process.env.DATABASE_USERNAME,
  database: process.env.DATABASE_TEST_SCHEMA,
  entities: entities,
  migrations: ['dist/models/migrations/*.js'],
  synchronize: true,
  logging: ['warn', 'error'],
};

export default testOrmConfig;
