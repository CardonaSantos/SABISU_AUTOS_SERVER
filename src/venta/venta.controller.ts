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
import { VentaService } from './venta.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';

@Controller('venta')
export class VentaController {
  constructor(private readonly ventaService: VentaService) {}

  @Post()
  async create(@Body() createVentaDto: CreateVentaDto) {
    return await this.ventaService.create(createVentaDto);
  }

  @Get()
  async findAll() {
    return await this.ventaService.findAll();
  }

  @Get('/get-sale/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.ventaService.findOneSale(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVentaDto: UpdateVentaDto,
  ) {
    return await this.ventaService.update(id, updateVentaDto);
  }

  @Delete('/delete-all')
  async removeAll() {
    return await this.ventaService.removeAll();
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.ventaService.remove(id);
  }
}
