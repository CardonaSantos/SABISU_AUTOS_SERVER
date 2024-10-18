import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SucursalesService } from './sucursales.service';
import { CreateSucursaleDto } from './dto/create-sucursale.dto';
import { UpdateSucursaleDto } from './dto/update-sucursale.dto';

@Controller('sucursales')
export class SucursalesController {
  constructor(private readonly sucursalesService: SucursalesService) {}

  @Post()
  create(@Body() createSucursaleDto: CreateSucursaleDto) {
    return this.sucursalesService.create(createSucursaleDto);
  }

  @Get()
  findAll() {
    return this.sucursalesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sucursalesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSucursaleDto: UpdateSucursaleDto) {
    return this.sucursalesService.update(+id, updateSucursaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sucursalesService.remove(+id);
  }
}
