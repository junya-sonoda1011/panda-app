import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.service.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [AuthModule],
  exports: [AuthControllerModule],
  controllers: [AuthController],
})
export class AuthControllerModule {}
