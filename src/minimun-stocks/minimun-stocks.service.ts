import { Injectable } from '@nestjs/common';
import { CreateMinimunStockDto } from './dto/create-minimun-stock.dto';
import { UpdateMinimunStockDto } from './dto/update-minimun-stock.dto';

@Injectable()
export class MinimunStocksService {
  create(createMinimunStockDto: CreateMinimunStockDto) {
    return 'This action adds a new minimunStock';
  }

  findAll() {
    return `This action returns all minimunStocks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} minimunStock`;
  }

  update(id: number, updateMinimunStockDto: UpdateMinimunStockDto) {
    return `This action updates a #${id} minimunStock`;
  }

  remove(id: number) {
    return `This action removes a #${id} minimunStock`;
  }
}
