import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRequisicionDto } from './dto/create-requisicion.dto';
import { UpdateRequisicionDto } from './dto/update-requisicion.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateRequisitionDto,
  RequisitionResponse,
  StockAlertItem,
} from './utils';

@Injectable()
export class RequisicionService {
  constructor(private readonly prisma: PrismaService) {}

  async getStockAlerts(sucursalId: number): Promise<StockAlertItem[]> {
    // Se asume una tabla StockThreshold vinculada a Producto + Sucursal
    const thresholds = await this.prisma.stockThreshold.findMany({
      include: {
        producto: { select: { nombre: true, precioCostoActual: true } },
      },
    });

    const alerts: StockAlertItem[] = [];
    for (const t of thresholds) {
      const { _sum } = await this.prisma.stock.aggregate({
        where: { productoId: t.productoId, sucursalId },
        _sum: { cantidad: true },
      });
      const stockActual = _sum.cantidad ?? 0;
      if (stockActual <= t.stockMinimo) {
        const faltante = Math.max(t.stockMinimo - stockActual, 1);
        alerts.push({
          productoId: t.productoId,
          nombre: t.producto.nombre,
          stockActual,
          stockMinimo: t.stockMinimo,
          cantidadSugerida: faltante,
          precioCosto: t.producto.precioCostoActual,
        });
      }
    }
    return alerts;
  }

  /* ---------- Paso C ---------- */
  async createWithLines(
    dto: CreateRequisitionDto,
  ): Promise<RequisitionResponse> {
    if (!dto.lineas.length) {
      throw new HttpException(
        { code: 'SIN_LINEAS', message: 'No se incluyeron productos' },
        HttpStatus.BAD_REQUEST,
      );
    }

    /* ---------- 1. Construir líneas y total ---------- */
    const lineasCreate = await Promise.all(
      dto.lineas.map(async ({ productoId, cantidadSugerida }) => {
        const threshold = await this.prisma.stockThreshold.findFirst({
          where: { productoId },
          include: {
            producto: {
              select: {
                nombre: true,
                codigoProducto: true,
                precioCostoActual: true,
              },
            },
          },
        });

        if (!threshold) {
          throw new HttpException(
            { code: 'UMBRAL_NO_ENCONTRADO', productoId },
            HttpStatus.BAD_REQUEST,
          );
        }

        const { _sum } = await this.prisma.stock.aggregate({
          where: { productoId, sucursalId: dto.sucursalId },
          _sum: { cantidad: true },
        });

        return {
          productoId,
          cantidadActual: _sum.cantidad ?? 0,
          stockMinimo: threshold.stockMinimo,
          cantidadSugerida,
          precioUnitario: threshold.producto.precioCostoActual,
        };
      }),
    );

    const totalRequisicion = lineasCreate.reduce(
      (acc, l) => acc + l.precioUnitario * l.cantidadSugerida,
      0,
    );

    const year = new Date().getFullYear();

    /* ---------- 2. Transacción atómica ---------- */
    const requisicion = await this.prisma.$transaction(async (tx) => {
      // 2.1 Cabecera provisional (folio vacío)
      const cabecera = await tx.requisicion.create({
        data: {
          folio: '', // placeholder
          sucursalId: dto.sucursalId,
          usuarioId: dto.usuarioId,
          observaciones: dto.observaciones,
          totalLineas: lineasCreate.length,
          totalRequisicion,
        },
      });

      // 2.2 Generar folio único a partir del ID
      const folio = `REQ-${year}-${String(cabecera.id).padStart(4, '0')}`;

      // 2.3 Actualizar folio + crear líneas
      const completa = await tx.requisicion.update({
        where: { id: cabecera.id },
        data: {
          folio,
          lineas: { createMany: { data: lineasCreate } },
        },
        include: { lineas: true, sucursal: true, usuario: true },
      });

      return completa;
    });

    /* ---------- 3. Adaptar salida ---------- */
    return {
      ...requisicion,
      fecha: requisicion.fecha.toISOString(),
      estado: 'PENDIENTE',
    };
  }

  create(createRequisicionDto: CreateRequisicionDto) {
    return 'This action adds a new requisicion';
  }

  async findAll() {
    try {
      const requisiciones = await this.prisma.requisicion.findMany({
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              rol: true,
            },
          },
          lineas: {
            select: {
              id: true,
              cantidadActual: true,
              cantidadSugerida: true,
              createdAt: true,
              precioUnitario: true,
              stockMinimo: true,
              updatedAt: true,
              producto: {
                select: {
                  id: true,
                  codigoProducto: true,
                  nombre: true,
                },
              },
            },
          },
          sucursal: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      });
      return requisiciones;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async findOne(id: number) {
    const requisiciones = await this.prisma.requisicion.findUnique({
      where: {
        id,
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            rol: true,
          },
        },
        lineas: {
          select: {
            id: true,
            cantidadActual: true,
            cantidadSugerida: true,
            createdAt: true,
            precioUnitario: true,
            stockMinimo: true,
            updatedAt: true,
            producto: {
              select: {
                id: true,
                codigoProducto: true,
                nombre: true,
              },
            },
          },
        },
        sucursal: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });
    return requisiciones;
  }
  catch(error) {
    console.log(error);
    return error;
  }

  update(id: number, updateRequisicionDto: UpdateRequisicionDto) {
    return `This action updates a #${id} requisicion`;
  }

  async remove(id: number) {
    try {
      console.log('Entrando al remove de requisiciones');

      if (!id) {
        throw new NotFoundException(
          'Error al encontrar registro de requisicion',
        );
      }

      const requisicionToDelete = await this.prisma.requisicion.delete({
        where: {
          id,
        },
      });
      return requisicionToDelete;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
