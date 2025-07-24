import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateSaleDeletedDto } from './dto/create-sale-deleted.dto';
import { UpdateSaleDeletedDto } from './dto/update-sale-deleted.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { HistorialStockTrackerService } from 'src/historial-stock-tracker/historial-stock-tracker.service';

@Injectable()
export class SaleDeletedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tracker: HistorialStockTrackerService,
  ) {}

  async create(createSaleDeletedDto: CreateSaleDeletedDto) {
    const {
      usuarioId,
      motivo,
      totalVenta,
      clienteId,
      productos,
      adminPassword,
      sucursalId,
      ventaId,
    } = createSaleDeletedDto;

    return this.prisma.$transaction(async (tx) => {
      const usuarioAdmin = await tx.usuario.findUnique({
        where: { id: usuarioId },
      });
      if (
        !usuarioAdmin ||
        !(await bcrypt.compare(adminPassword, usuarioAdmin.contrasena))
      ) {
        throw new UnauthorizedException(
          'Credenciales de administrador incorrectas.',
        );
      }

      // Crear venta eliminada
      const clienteIdFinal = clienteId && clienteId > 0 ? clienteId : null;
      const ventaEliminada = await tx.ventaEliminada.create({
        data: {
          usuarioId,
          motivo,
          totalVenta,
          clienteId: clienteIdFinal,
          sucursalId,
        },
      });

      if (!ventaEliminada || !ventaEliminada.id) {
        throw new InternalServerErrorException(
          'No se pudo crear la venta eliminada',
        );
      }

      // Vincular productos y preparar restauración de stock
      const productosParaTracker: any[] = [];

      for (const prod of productos) {
        if (!prod.productoId || prod.productoId <= 0) {
          throw new BadRequestException(
            `Producto inválido: ID = ${prod.productoId}`,
          );
        }
        await tx.ventaEliminadaProducto.create({
          data: {
            ventaEliminadaId: ventaEliminada.id,
            productoId: prod.productoId,
            cantidad: prod.cantidad,
            precioVenta: prod.precioVenta,
          },
        });

        const agg = await tx.stock.aggregate({
          _sum: { cantidad: true },
          where: { productoId: prod.productoId, sucursalId },
        });
        const cantidadAnterior = agg._sum.cantidad ?? 0;
        const cantidadRestaurada = prod.cantidad;

        // Restaurar stock al lote más antiguo o crear nuevo
        const lote = await tx.stock.findFirst({
          where: { productoId: prod.productoId, sucursalId },
          orderBy: { fechaIngreso: 'asc' },
        });
        let stockRestaurado;
        if (lote) {
          stockRestaurado = await tx.stock.update({
            where: { id: lote.id },
            data: { cantidad: { increment: cantidadRestaurada } },
          });
        } else {
          stockRestaurado = await tx.stock.create({
            data: {
              productoId: prod.productoId,
              cantidad: cantidadRestaurada,
              costoTotal: 0,
              fechaIngreso: new Date(),
              precioCosto: 0,
              sucursalId: sucursalId,
            },
          });
        }

        // Guarda cantidades para historial
        productosParaTracker.push({
          productoId: prod.productoId,
          cantidadEliminada: prod.cantidad,
          cantidadAnterior,
          cantidadNueva: cantidadAnterior + cantidadRestaurada,
        });
      }

      // Eliminar la venta original
      if (!ventaId) {
        throw new BadRequestException('Error id de la venta no encontrado');
      }
      await tx.venta.delete({ where: { id: ventaId } });

      await tx.sucursalSaldo.update({
        where: { sucursalId },
        data: {
          saldoAcumulado: { decrement: totalVenta },
          totalIngresos: { decrement: totalVenta },
        },
      });

      await this.tracker.trackerEliminacionVenta(
        tx,
        productosParaTracker,
        sucursalId,
        usuarioId,
        ventaEliminada.id,
        motivo ?? 'Venta eliminada',
      );

      return ventaEliminada;
    });
  }

  findAll() {
    return `This action returns all saleDeleted`;
  }

  async findMySalesDeleted(sucursalId: number) {
    try {
      const regists = await this.prisma.ventaEliminada.findMany({
        orderBy: {
          fechaEliminacion: 'desc',
        },
        where: {
          sucursalId,
        },
        include: {
          cliente: {
            select: {
              id: true,
              nombre: true,
              telefono: true,
              dpi: true,
              direccion: true,
            },
          },
          VentaEliminadaProducto: {
            select: {
              id: true,
              cantidad: true,
              precioVenta: true,
              producto: {
                select: {
                  id: true,
                  nombre: true,
                  codigoProducto: true,
                },
              },
            },
          },
          usuario: {
            select: {
              id: true,
              nombre: true,
              rol: true,
            },
          },
        },
      });
      return regists;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} saleDeleted`;
  }

  update(id: number, updateSaleDeletedDto: UpdateSaleDeletedDto) {
    return `This action updates a #${id} saleDeleted`;
  }

  async removeAll() {
    try {
      const regists = await this.prisma.ventaEliminada.deleteMany({});
      return regists;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} saleDeleted`;
  }
}
