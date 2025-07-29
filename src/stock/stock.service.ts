import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateStockDto, StockEntryDTO } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEntregaStockDto } from 'src/entrega-stock/dto/create-entrega-stock.dto';
import { AjusteStockService } from 'src/ajuste-stock/ajuste-stock.service';
import { DeleteStockDto } from './dto/delete-stock.dto';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/es-mx';
import { HistorialStockTrackerService } from 'src/historial-stock-tracker/historial-stock-tracker.service';
import { TypeOperationStockTracker } from 'src/historial-stock-tracker/utils';

dayjs.extend(utc);
dayjs.locale('es-mx');
dayjs.extend(timezone);

@Injectable()
export class StockService {
  //
  constructor(
    private readonly prisma: PrismaService,
    private readonly ajusteStock: AjusteStockService,
    private readonly tracker: HistorialStockTrackerService,
  ) {}

  async create(createStockDto: StockEntryDTO) {
    const { proveedorId, stockEntries, sucursalId, recibidoPorId } =
      createStockDto;

    try {
      // Calcular el costo total de la entrega
      const costoStockEntrega = stockEntries.reduce(
        (total, entry) => total + entry.cantidad * entry.precioCosto,
        0,
      );

      // Crear la entrega de stock
      const entregaStock = await this.prisma.entregaStock.create({
        data: {
          proveedorId,
          montoTotal: costoStockEntrega,
          recibidoPorId,
          sucursalId,
        },
      });

      const historialTrackers = [];

      for (const entry of stockEntries) {
        // Obtener cantidad actual del producto en esa sucursal
        const sumaStockActual = await this.prisma.stock.aggregate({
          where: {
            productoId: entry.productoId,
            sucursalId,
          },
          _sum: {
            cantidad: true,
          },
        });

        const cantidadAnterior = sumaStockActual._sum.cantidad ?? 0;
        const cantidadNueva = cantidadAnterior + entry.cantidad;

        // Crear el registro de stock
        const registroStock = await this.prisma.stock.create({
          data: {
            productoId: entry.productoId,
            cantidad: entry.cantidad,
            cantidadInicial: entry.cantidad,
            costoTotal: entry.precioCosto * entry.cantidad,
            fechaIngreso: entry.fechaIngreso,
            fechaVencimiento: dayjs
              .tz(entry.fechaVencimiento, 'America/Guatemala')
              .toDate(),
            precioCosto: entry.precioCosto,
            entregaStockId: entregaStock.id,
            sucursalId,
          },
        });

        // Armar la data para trackeo
        historialTrackers.push({
          productoId: entry.productoId,
          cantidadAnterior,
          cantidadVendida: entry.cantidad,
        });
      }

      // Trackear entrega de stock por producto
      await this.tracker.trackeEntregaStock(
        this.prisma, // no se usa transacción por ahora
        historialTrackers,
        sucursalId,
        recibidoPorId,
        entregaStock.id,
        'ENTREGA_STOCK',
        `Registro generado por entrega #${entregaStock.id}`,
      );

      return entregaStock;
    } catch (error) {
      console.error('Error al crear la entrega de stock:', error);
      throw new InternalServerErrorException(
        'Error al crear la entrega de stock',
      );
    }
  }

  async findAll() {
    try {
      const stocks = await this.prisma.stock.findMany({});
      return stocks;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al obtener los stocks');
    }
  }

  async findOne(id: number) {
    try {
      const stock = await this.prisma.stock.findUnique({
        where: { id },
      });
      if (!stock) {
        throw new NotFoundException(`Stock con ID ${id} no encontrado`);
      }
      return stock;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al encontrar el stock');
    }
  }

  async findOneStock(id: number) {
    try {
      const stock = await this.prisma.stock.findUnique({
        where: { id },
        include: {
          producto: {
            select: {
              nombre: true,
              id: true,
            },
          },
        },
      });
      if (!stock) {
        throw new NotFoundException(`Stock con ID ${id} no encontrado`);
      }
      return stock;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al encontrar el stock');
    }
  }

  async deleteOneStock(dto: DeleteStockDto) {
    return this.prisma.$transaction(async (tx) => {
      const stockToDelete = await tx.stock.findUnique({
        where: { id: dto.stockId },
      });
      if (!stockToDelete) {
        throw new BadRequestException('Stock no encontrado');
      }

      // Calcular stock total antes de eliminar
      const { _sum } = await tx.stock.aggregate({
        where: {
          productoId: dto.productoId,
          sucursalId: dto.sucursalId,
        },
        _sum: { cantidad: true },
      });
      const cantidadAnterior = _sum.cantidad ?? 0;
      const cantidadStockEliminada = stockToDelete.cantidad;
      const stockRestante = cantidadAnterior - cantidadStockEliminada;

      const registroEliminacion = await tx.eliminacionStock.create({
        data: {
          productoId: dto.productoId,
          sucursalId: dto.sucursalId,
          usuarioId: dto.usuarioId,
          motivo: dto.motivo ?? 'Sin motivo especificado',
          fechaHora: new Date(),
          cantidadAnterior,
          cantidadStockEliminada,
          stockRestante,
          referenciaTipo: (dto as any).referenciaTipo,
          referenciaId: (dto as any).referenciaId,
        },
      });

      await tx.stock.delete({
        where: { id: dto.stockId },
      });

      await this.tracker.trackerStockEliminacion(
        tx,
        dto.productoId,
        dto.sucursalId,
        dto.usuarioId,
        cantidadAnterior,
        stockRestante,
        registroEliminacion.id,
        dto.motivo ?? 'Sin motivo especificado',
      );

      return registroEliminacion;
    });
  }

  // Total de stock de un producto en una sucursal
  async getTotalStock(productoId: number, sucursalId: number): Promise<number> {
    const { _sum } = await this.prisma.stock.aggregate({
      where: { productoId, sucursalId },
      _sum: { cantidad: true },
    });
    return _sum.cantidad ?? 0;
  }

  async update(id: number, updateStockDto: UpdateStockDto) {
    try {
      const stock = await this.prisma.stock.update({
        where: { id },
        data: updateStockDto,
      });
      if (!stock) {
        throw new NotFoundException(`Stock con ID ${id} no encontrado`);
      }
      return stock;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al actualizar el stock');
    }
  }

  async removeAll() {
    try {
      const stocks = await this.prisma.stock.deleteMany({});
      return stocks;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al eliminar los stocks');
    }
  }

  async remove(id: number) {
    try {
      const stock = await this.prisma.stock.delete({
        where: { id },
      });
      if (!stock) {
        throw new NotFoundException(`Stock con ID ${id} no encontrado`);
      }
      return stock;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al eliminar el stock');
    }
  }

  async deleteStock(idStock: number, userID: number) {
    try {
      const stockToDelete = await this.prisma.stock.findUnique({
        where: {
          id: idStock,
        },
      });

      if (!stockToDelete) {
        throw new BadRequestException('Error al encontrar stock para eliminar');
      }

      await this.prisma.stock.delete({
        where: {
          id: stockToDelete.id,
        },
      });

      console.log('El stock a sido eliminado');

      return stockToDelete;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al eliminar stock ');
    }
  }
}
