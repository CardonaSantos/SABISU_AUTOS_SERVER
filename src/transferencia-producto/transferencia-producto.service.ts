import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateTransferenciaProductoDto } from './dto/create-transferencia-producto.dto';
import { UpdateTransferenciaProductoDto } from './dto/update-transferencia-producto.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationService } from 'src/notification/notification.service';
import { HistorialStockTrackerService } from 'src/historial-stock-tracker/historial-stock-tracker.service';

@Injectable()
export class TransferenciaProductoService {
  private readonly logger = new Logger(TransferenciaProductoService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async transferirProducto(dto: CreateTransferenciaProductoDto) {
    const {
      productoId,
      cantidad,
      sucursalOrigenId,
      sucursalDestinoId,
      usuarioEncargadoId,
    } = dto;

    return this.prisma.$transaction(async (tx) => {
      // 1. Buscar los stocks origen en FIFO
      const stockOrigenes = await tx.stock.findMany({
        where: { productoId, sucursalId: sucursalOrigenId },
        orderBy: { fechaIngreso: 'asc' },
      });

      const cantidadTotalStockOrigen = stockOrigenes.reduce(
        (total, stock) => total + stock.cantidad,
        0,
      );
      if (cantidadTotalStockOrigen < cantidad) {
        throw new Error('Stock insuficiente en la sucursal de origen');
      }

      const cantidadAnterior = cantidadTotalStockOrigen;
      const cantidadNueva = cantidadTotalStockOrigen - cantidad;

      // 3. FIFO: descontar en origen
      let cantidadRestante = cantidad;
      for (const stock of stockOrigenes) {
        if (cantidadRestante === 0) break;
        if (stock.cantidad <= cantidadRestante) {
          await tx.stock.update({
            where: { id: stock.id },
            data: { cantidad: 0 },
          });
          cantidadRestante -= stock.cantidad;
        } else {
          await tx.stock.update({
            where: { id: stock.id },
            data: { cantidad: stock.cantidad - cantidadRestante },
          });
          cantidadRestante = 0;
        }
      }

      const stockDestino = await tx.stock.findFirst({
        where: { productoId, sucursalId: sucursalDestinoId },
      });
      if (stockDestino) {
        await tx.stock.update({
          where: { id: stockDestino.id },
          data: { cantidad: stockDestino.cantidad + cantidad },
        });
      } else {
        await tx.stock.create({
          data: {
            productoId,
            sucursalId: sucursalDestinoId,
            cantidad,
            precioCosto: stockOrigenes[0]?.precioCosto ?? 0,
            costoTotal: (stockOrigenes[0]?.precioCosto ?? 0) * cantidad,
            fechaIngreso: new Date(),
          },
        });
      }

      const transferencia = await tx.transferenciaProducto.create({
        data: {
          productoId,
          cantidad,
          sucursalOrigenId,
          sucursalDestinoId,
          usuarioEncargadoId,
          fechaTransferencia: new Date(),
        },
      });

      return { message: 'Transferencia realizada con éxito' };
    });
  }

  findAll() {
    return `This action returns all transferenciaProducto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transferenciaProducto`;
  }

  async findAllMytranslates(id: number) {
    try {
      const translates = await this.prisma.transferenciaProducto.findMany({
        where: {
          sucursalOrigenId: id,
        },
        include: {
          producto: true,
          usuarioEncargado: true,
          sucursalDestino: true,
          sucursalOrigen: true,
        },
      });

      console.log(translates);

      return translates;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al conseguir registros');
    }
  }

  update(
    id: number,
    updateTransferenciaProductoDto: UpdateTransferenciaProductoDto,
  ) {
    return `This action updates a #${id} transferenciaProducto`;
  }

  remove(id: number) {
    return `This action removes a #${id} transferenciaProducto`;
  }

  async removeAll() {
    try {
      const borrados = await this.prisma.transferenciaProducto.deleteMany({});
      return borrados;
    } catch (error) {
      console.log(error);
    }
  }
}
