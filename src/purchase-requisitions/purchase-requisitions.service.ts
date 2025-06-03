import { Injectable } from '@nestjs/common';
import { CreatePurchaseRequisitionDto } from './dto/create-purchase-requisition.dto';
import { UpdatePurchaseRequisitionDto } from './dto/update-purchase-requisition.dto';

@Injectable()
export class PurchaseRequisitionsService {
  create(createPurchaseRequisitionDto: CreatePurchaseRequisitionDto) {
    return 'This action adds a new purchaseRequisition';
  }

  findAll() {
    return `This action returns all purchaseRequisitions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} purchaseRequisition`;
  }

  update(id: number, updatePurchaseRequisitionDto: UpdatePurchaseRequisitionDto) {
    return `This action updates a #${id} purchaseRequisition`;
  }

  remove(id: number) {
    return `This action removes a #${id} purchaseRequisition`;
  }
}
