import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateVentaProductoDto } from './dto/create-venta-producto.dto';
import { UpdateVentaProductoDto } from './dto/update-venta-producto.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VentaProductoService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createVentaProductoDto: CreateVentaProductoDto) {
    try {
      const ventaProducto = await this.prisma.ventaProducto.create({
        data: createVentaProductoDto,
      });
      return ventaProducto;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al crear la ventaProducto');
    }
  }

  async findAll() {
    try {
      const ventasProductos = await this.prisma.ventaProducto.findMany({});
      return ventasProductos;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error al obtener las ventasProductos',
      );
    }
  }

  async findOne(id: number) {
    try {
      const ventaProducto = await this.prisma.ventaProducto.findUnique({
        where: { id },
      });
      if (!ventaProducto) {
        throw new NotFoundException(`VentaProducto con ID ${id} no encontrado`);
      }
      return ventaProducto;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error al encontrar la ventaProducto',
      );
    }
  }

  async update(id: number, updateVentaProductoDto: UpdateVentaProductoDto) {
    try {
      const ventaProducto = await this.prisma.ventaProducto.update({
        where: { id },
        data: updateVentaProductoDto,
      });
      if (!ventaProducto) {
        throw new NotFoundException(`VentaProducto con ID ${id} no encontrado`);
      }
      return ventaProducto;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error al actualizar la ventaProducto',
      );
    }
  }

  async removeAll() {
    try {
      const ventaProducto = await this.prisma.ventaProducto.deleteMany({});
      if (!ventaProducto) {
        throw new NotFoundException(`Error al eliminar los registros`);
      }
      return ventaProducto;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error al eliminar la ventaProducto',
      );
    }
  }

  async remove(id: number) {
    try {
      const ventaProducto = await this.prisma.ventaProducto.delete({
        where: { id },
      });
      if (!ventaProducto) {
        throw new NotFoundException(`VentaProducto con ID ${id} no encontrado`);
      }
      return ventaProducto;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error al eliminar la ventaProducto',
      );
    }
  }
}
