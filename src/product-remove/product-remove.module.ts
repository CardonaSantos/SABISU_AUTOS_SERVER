import { Module } from '@nestjs/common';
import { ProductRemoveService } from './product-remove.service';
import { ProductRemoveController } from './product-remove.controller';

@Module({
  controllers: [ProductRemoveController],
  providers: [ProductRemoveService],
})
export class ProductRemoveModule {}
