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
import { EntregaStockService } from './entrega-stock.service';
import { CreateEntregaStockDto } from './dto/create-entrega-stock.dto';
import { UpdateEntregaStockDto } from './dto/update-entrega-stock.dto';

@Controller('entrega-stock')
export class EntregaStockController {
  constructor(private readonly entregaStockService: EntregaStockService) {}

  @Post()
  async create(@Body() createEntregaStockDto: CreateEntregaStockDto) {
    return await this.entregaStockService.create(createEntregaStockDto);
  }

  @Get()
  async findAll() {
    return await this.entregaStockService.findAll();
  }

  @Get('/get-entregas-stock/:id')
  async findAllEntregasStock(@Param('id', ParseIntPipe) id: number) {
    return await this.entregaStockService.findAllEntregasStockBySucursal(id);
  }

  @Get('/get-my-delivery-stock/:id')
  async findEntregasStock(@Param('id', ParseIntPipe) id: number) {
    return await this.entregaStockService.findAllDeliveryStock(id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.entregaStockService.findAllEntregasStock(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEntregaStockDto: UpdateEntregaStockDto,
  ) {
    return await this.entregaStockService.update(id, updateEntregaStockDto);
  }

  @Delete('/delete-all')
  async removeAll() {
    return await this.entregaStockService.removeAll();
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.entregaStockService.remove(id);
  }
}
