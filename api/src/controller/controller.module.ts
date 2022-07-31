import { Module } from '@nestjs/common';
import { UsersControllerModule } from './users/users.contorller.module';

@Module({
  imports: [UsersControllerModule],
})
export class ControllerModule {}
