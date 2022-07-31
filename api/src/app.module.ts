import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ControllerModule } from './controller/controller.module';
import { OrmModule } from './models/orm.module';

@Module({
  imports: [OrmModule, ControllerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
