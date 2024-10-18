import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto, StockEntryDTO } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Controller('stock')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Post()
  async create(@Body() createStockDto: StockEntryDTO) {
    console.log('Entrando al stock controller');
    return await this.stockService.create(createStockDto);
  }

  @Get()
  async findAll() {
    return await this.stockService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.stockService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    return await this.stockService.update(id, updateStockDto);
  }

  @Delete('/delete-all')
  async removeAll() {
    return await this.stockService.removeAll();
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.stockService.remove(id);
  }
}
