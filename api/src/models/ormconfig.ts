import { Injectable } from '@nestjs/common';

import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
// export const ormConfig: TypeOrmModuleOptions = {
//   type: 'mysql',
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT, 10),
//   password: process.env.DB_PASSWORD,
//   username: process.env.DB_USER,
//   database: process.env.DB_DATABASE,
//   entities: ['dist/models/entities/*.entity.js'],
//   migrations: ['dist/models/migrations/*.js'],
//   cli: {
//     entitiesDir: 'src/models/entities',
//     migrationsDir: 'src/models/migrations',
//   },
// };

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  // constructor(private configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: process.env.TYPEORM_HOST,
      port: parseInt(process.env.TYPEORM_PORT),
      password: process.env.TYPEORM_PASSWORD,
      username: process.env.TYPEORM_USERNAME,
      database: process.env.TYPEORM_DATABASE,
      entities: ['dist/models/entities/*.entity.js'],
      migrations: ['dist/models/migrations/*.js'],
      cli: {
        entitiesDir: 'src/models/entities',
        migrationsDir: 'src/models/migrations',
      },
    };
  }
}
