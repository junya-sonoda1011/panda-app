import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.service.module';
import { UsersModule } from 'src/modules/users/users.service.module';
import { UsersController } from './users.contorller';

@Module({
  imports: [UsersModule, AuthModule],
  exports: [UsersControllerModule],
  controllers: [UsersController],
})
export class UsersControllerModule {}
