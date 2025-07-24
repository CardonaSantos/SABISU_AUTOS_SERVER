import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { StockRemoveService } from './stock-remove.service';
import { CreateStockRemoveDto } from './dto/create-stock-remove.dto';
import { UpdateStockRemoveDto } from './dto/update-stock-remove.dto';

@Controller('stock-remove')
export class StockRemoveController {
  constructor(private readonly stockRemoveService: StockRemoveService) {}

  @Get('/get-stock-remove-regists')
  findAllStockRemove() {
    return this.stockRemoveService.find_remove_stock();
  }
}
