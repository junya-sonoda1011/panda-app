import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from 'src/models/ormconfig';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      // imports: [ConfigModule],
      // inject: [ConfigService],
      // useFactory: (configService: ConfigService) => ({
      //   ...ormConfig,
      // }),
      useClass: TypeOrmConfigService,
    }),
  ],
  exports: [OrmModule],
})
export class OrmModule {}
