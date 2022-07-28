import { ConnectionOptions } from 'typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'dev';
const dotenv_path = path.resolve(process.cwd(), `.${env}.env`);
const result = dotenv.config({ path: dotenv_path });
if (result.error) {
  /* do nothing */
}

export const ormConfig: ConnectionOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  password: process.env.DATABASE_PASSWORD,
  username: process.env.DATABASE_USERNAME,
  database: process.env.DATABASE_SCHEMA,
  entities: ['dist/models/entities/*.entity.js'],
  migrations: ['dist/models/migrations/*.js'],
  cli: {
    entitiesDir: 'src/models/entities',
    migrationsDir: 'src/models/migrations',
  },
};

export default ormConfig;
