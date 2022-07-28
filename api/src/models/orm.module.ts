import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from 'src/config/ormconfig';

@Global()
@Module({
  imports: [TypeOrmModule.forRoot(ormConfig)],
  exports: [OrmModule],
})
export class OrmModule {}
