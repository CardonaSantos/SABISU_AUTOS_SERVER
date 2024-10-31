import { Injectable } from '@nestjs/common';
import { CreateProductRemoveDto } from './dto/create-product-remove.dto';
import { UpdateProductRemoveDto } from './dto/update-product-remove.dto';

@Injectable()
export class ProductRemoveService {
  create(createProductRemoveDto: CreateProductRemoveDto) {
    return 'This action adds a new productRemove';
  }

  findAll() {
    return `This action returns all productRemove`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productRemove`;
  }

  update(id: number, updateProductRemoveDto: UpdateProductRemoveDto) {
    return `This action updates a #${id} productRemove`;
  }

  remove(id: number) {
    return `This action removes a #${id} productRemove`;
  }
}
