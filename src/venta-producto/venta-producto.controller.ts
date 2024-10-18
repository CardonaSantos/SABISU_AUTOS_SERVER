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
import { VentaProductoService } from './venta-producto.service';
import { CreateVentaProductoDto } from './dto/create-venta-producto.dto';
import { UpdateVentaProductoDto } from './dto/update-venta-producto.dto';

@Controller('venta-producto')
export class VentaProductoController {
  constructor(private readonly ventaProductoService: VentaProductoService) {}

  @Post()
  async create(@Body() createVentaProductoDto: CreateVentaProductoDto) {
    return await this.ventaProductoService.create(createVentaProductoDto);
  }

  @Get()
  async findAll() {
    return await this.ventaProductoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.ventaProductoService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateVentaProductoDto: UpdateVentaProductoDto,
  ) {
    return await this.ventaProductoService.update(id, updateVentaProductoDto);
  }

  @Delete('/delete-all')
  removeAll() {
    return this.ventaProductoService.removeAll();
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.ventaProductoService.remove(id);
  }
}
