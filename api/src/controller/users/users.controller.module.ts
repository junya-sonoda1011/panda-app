import { Module } from '@nestjs/common';
import { AuthModule } from '../../modules/auth/auth.service.module';
import { UsersModule } from '../../modules/users/users.service.module';
import { UsersController } from './users.controller';

@Module({
  imports: [UsersModule, AuthModule],
  exports: [UsersControllerModule],
  controllers: [UsersController],
})
export class UsersControllerModule {}
