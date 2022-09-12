import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../src/models/entities/user.entity';
import testOrmConfig from '../src/config/test_ormconfig';

@Module({
  imports: [
    TypeOrmModule.forRoot(testOrmConfig),
    TypeOrmModule.forFeature([User]),
  ],
  exports: [TestGlobalModule],
})
export class TestGlobalModule {}

export const testValidationPipeOptions = {
  forbidUnknownValues: true,
  whitelist: true,
  forbidNonWhitelisted: true,
};
