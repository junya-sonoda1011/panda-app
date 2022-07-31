import { Module } from '@nestjs/common';
import { UserModule } from 'src/modules/users/users.service';
import { UsersController } from './users.contorller';

@Module({
  imports: [UserModule],
  exports: [UsersControllerModule],
  controllers: [UsersController],
})
export class UsersControllerModule {}
