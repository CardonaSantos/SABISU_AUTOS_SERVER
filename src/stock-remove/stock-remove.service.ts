import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateStockRemoveDto } from './dto/create-stock-remove.dto';
import { UpdateStockRemoveDto } from './dto/update-stock-remove.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StockRemoveService {
  constructor(private readonly prisma: PrismaService) {}

  async find_remove_stock() {
    try {
      const regists = await this.prisma.eliminacionStock.findMany({
        select: {
          id: true,
          productoId: true,
          fechaHora: true,
          usuarioId: true,
          sucursalId: true,
          motivo: true,
          cantidadAnterior: true,
          cantidadStockEliminada: true,
          stockRestante: true,
          referenciaTipo: true,
          referenciaId: true,
          createdAt: true,
          updatedAt: true,
          producto: {
            select: {
              id: true,
              nombre: true,
              descripcion: true,
              codigoProducto: true,
            },
          },
          usuario: {
            select: {
              id: true,
              nombre: true,
              rol: true,
            },
          },
          sucursal: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
        orderBy: { fechaHora: 'desc' },
      });

      if (!regists || regists.length === 0) {
        throw new NotFoundException(
          'No se encontraron registros de eliminación de stock',
        );
      }

      return regists;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error al conseguir los registros de elimina­ción de stock',
      );
    }
  }
}
