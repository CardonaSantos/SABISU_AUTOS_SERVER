import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ImagenesProductoService } from './imagenes-producto.service';
import { CreateImagenesProductoDto } from './dto/create-imagenes-producto.dto';
import { UpdateImagenesProductoDto } from './dto/update-imagenes-producto.dto';

@Controller('imagenes-producto')
export class ImagenesProductoController {
  constructor(private readonly imagenesProductoService: ImagenesProductoService) {}

  @Post()
  create(@Body() createImagenesProductoDto: CreateImagenesProductoDto) {
    return this.imagenesProductoService.create(createImagenesProductoDto);
  }

  @Get()
  findAll() {
    return this.imagenesProductoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.imagenesProductoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateImagenesProductoDto: UpdateImagenesProductoDto) {
    return this.imagenesProductoService.update(+id, updateImagenesProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.imagenesProductoService.remove(+id);
  }
}
