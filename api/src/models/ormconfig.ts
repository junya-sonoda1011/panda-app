import { Injectable } from '@nestjs/common';

import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  // constructor(private configService: ConfigService) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: process.env.DB_HOST,
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
