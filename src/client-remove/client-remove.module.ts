import { Module } from '@nestjs/common';
import { ClientRemoveService } from './client-remove.service';
import { ClientRemoveController } from './client-remove.controller';

@Module({
  controllers: [ClientRemoveController],
  providers: [ClientRemoveService],
})
export class ClientRemoveModule {}
