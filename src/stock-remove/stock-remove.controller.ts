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

  @Post()
  create(@Body() createStockRemoveDto: CreateStockRemoveDto) {
    return this.stockRemoveService.create(createStockRemoveDto);
  }

  @Get()
  findAll() {
    return this.stockRemoveService.findAll();
  }

  @Get('/get-stock-remove-regists')
  findAllStockRemove() {
    return this.stockRemoveService.find_remove_stock();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stockRemoveService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStockRemoveDto: UpdateStockRemoveDto,
  ) {
    return this.stockRemoveService.update(+id, updateStockRemoveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stockRemoveService.remove(+id);
  }
}
