import { Module } from '@nestjs/common';
import { UsersModule } from 'src/modules/users/users.service.module';
import { UsersController } from './users.contorller';

@Module({
  imports: [UsersModule],
  exports: [UsersControllerModule],
  controllers: [UsersController],
})
export class UsersControllerModule {}
