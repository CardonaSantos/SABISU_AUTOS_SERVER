import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MinimunStocksService } from './minimun-stocks.service';
import { CreateMinimunStockDto } from './dto/create-minimun-stock.dto';
import { UpdateMinimunStockDto } from './dto/update-minimun-stock.dto';

@Controller('minimun-stocks')
export class MinimunStocksController {
  constructor(private readonly minimunStocksService: MinimunStocksService) {}

  @Post()
  create(@Body() createMinimunStockDto: CreateMinimunStockDto) {
    return this.minimunStocksService.create(createMinimunStockDto);
  }

  @Get()
  findAll() {
    return this.minimunStocksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.minimunStocksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMinimunStockDto: UpdateMinimunStockDto) {
    return this.minimunStocksService.update(+id, updateMinimunStockDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.minimunStocksService.remove(+id);
  }
}
