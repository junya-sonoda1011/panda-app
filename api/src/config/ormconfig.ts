import { Injectable } from '@nestjs/common';

import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  // constructor(private configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
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
  }
}
