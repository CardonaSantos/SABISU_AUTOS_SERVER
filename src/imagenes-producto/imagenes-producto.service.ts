import { Injectable } from '@nestjs/common';
import { CreateImagenesProductoDto } from './dto/create-imagenes-producto.dto';
import { UpdateImagenesProductoDto } from './dto/update-imagenes-producto.dto';

@Injectable()
export class ImagenesProductoService {
  create(createImagenesProductoDto: CreateImagenesProductoDto) {
    return 'This action adds a new imagenesProducto';
  }

  findAll() {
    return `This action returns all imagenesProducto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} imagenesProducto`;
  }

  update(id: number, updateImagenesProductoDto: UpdateImagenesProductoDto) {
    return `This action updates a #${id} imagenesProducto`;
  }

  remove(id: number) {
    return `This action removes a #${id} imagenesProducto`;
  }
}
