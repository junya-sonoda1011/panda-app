import { Module } from '@nestjs/common';
import { AuthControllerModule } from './auth/auth.controller.module';
import { UsersControllerModule } from './users/users.contorller.module';

@Module({
  imports: [UsersControllerModule, AuthControllerModule],
})
export class ControllerModule {}
