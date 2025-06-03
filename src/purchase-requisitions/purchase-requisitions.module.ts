import { Module } from '@nestjs/common';
import { PurchaseRequisitionsService } from './purchase-requisitions.service';
import { PurchaseRequisitionsController } from './purchase-requisitions.controller';

@Module({
  controllers: [PurchaseRequisitionsController],
  providers: [PurchaseRequisitionsService],
})
export class PurchaseRequisitionsModule {}
