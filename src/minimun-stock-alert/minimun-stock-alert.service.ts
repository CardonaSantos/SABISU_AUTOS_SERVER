import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMinimunStockAlertDto } from './dto/create-minimun-stock-alert.dto';
import { UpdateMinimunStockAlertDto } from './dto/update-minimun-stock-alert.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { StockThreshold } from '@prisma/client';
import { NotFoundError } from 'rxjs';
export interface StockAlert {
  id: number;
  productoId: number;
  nombre: string;
  stockActual: number;
  stockMinimo: number;
  fecha: Date;
}

@Injectable()
export class MinimunStockAlertService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: { productoId: number; stockMinimo: number }) {
    const { productoId, stockMinimo } = dto;

    try {
      return await this.prisma.stockThreshold.create({
        data: {
          producto: { connect: { id: productoId } },
          stockMinimo,
        },
      });
    } catch (error) {
      console.error('Error creando StockThreshold', error);
      throw new InternalServerErrorException('No se pudo crear el umbral');
    }
  }

  async findAll(): Promise<
    Array<
      StockThreshold & {
        producto: {
          id: number;
          nombre: string;
          codigoProducto: string;
          codigoProveedor: string;
          descripcion: string;
          creadoEn: Date;
          actualizadoEn: Date;
        };
      }
    >
  > {
    try {
      return await this.prisma.stockThreshold.findMany({
        include: {
          producto: {
            select: {
              id: true,
              nombre: true,
              codigoProducto: true,
              codigoProveedor: true,
              descripcion: true,
              creadoEn: true,
              actualizadoEn: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Error al listar StockThresholds', error);
      throw new InternalServerErrorException('No se pudo obtener umbrales');
    }
  }

  async findAllMinimunStockAlerts(): Promise<StockAlert[]> {
    const thresholds = await this.prisma.stockThreshold.findMany({
      include: { producto: { select: { nombre: true } } },
      // orderBy: { stockMinimo: 'desc' },
    });

    const alerts: StockAlert[] = [];

    for (const t of thresholds) {
      const { _sum } = await this.prisma.stock.aggregate({
        where: { productoId: t.productoId },
        _sum: { cantidad: true },
      });
      const stockActual = _sum.cantidad ?? 0;

      if (stockActual <= t.stockMinimo) {
        alerts.push({
          id: t.id,
          productoId: t.productoId,
          nombre: t.producto.nombre,
          stockActual,
          stockMinimo: t.stockMinimo,
          fecha: t.actualizadoEn,
        });
      }
    }

    return alerts;
  }

  async findOne(id: number) {
    return this.prisma.stockThreshold.findUnique({ where: { id } });
  }

  async update(id: number, dto: { stockMinimo: number }) {
    return this.prisma.stockThreshold.update({
      where: { id },
      data: { stockMinimo: dto.stockMinimo },
    });
  }

  async removeAll() {
    return this.prisma.stockThreshold.deleteMany({});
  }

  async remove(id: number) {
    return this.prisma.stockThreshold.delete({ where: { id } });
  }
}
