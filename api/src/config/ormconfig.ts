import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const ormConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  password: process.env.DB_PASSWORD,
  username: 'root',
  database: 'develop',
  entities: ['dist/models/entities/*.entity.js'],
  migrations: ['dist/models/migrations/*.js'],
  cli: {
    entitiesDir: 'src/models/entities',
    migrationsDir: 'src/models/migrations',
  },
};

export default ormConfig;
