import { Injectable } from '@nestjs/common';
import { CreateTransferenciaProductoDto } from './dto/create-transferencia-producto.dto';
import { UpdateTransferenciaProductoDto } from './dto/update-transferencia-producto.dto';

@Injectable()
export class TransferenciaProductoService {
  create(createTransferenciaProductoDto: CreateTransferenciaProductoDto) {
    return 'This action adds a new transferenciaProducto';
  }

  findAll() {
    return `This action returns all transferenciaProducto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transferenciaProducto`;
  }

  update(id: number, updateTransferenciaProductoDto: UpdateTransferenciaProductoDto) {
    return `This action updates a #${id} transferenciaProducto`;
  }

  remove(id: number) {
    return `This action removes a #${id} transferenciaProducto`;
  }
}
