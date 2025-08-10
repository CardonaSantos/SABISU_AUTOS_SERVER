import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateMovimientoCajaDto } from './dto/create-movimiento-caja.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dayjs from 'dayjs';
import 'dayjs/locale/es';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { TZGT } from 'src/utils/utils';
import { MovimientoCajaItem } from './interface';
import { EstadoTurnoCaja, Prisma } from '@prisma/client';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale('es');

@Injectable()
export class MovimientoCajaService {
  private readonly logger = new Logger(MovimientoCajaService.name);

  constructor(private readonly prisma: PrismaService) {}

  async registrarMovimientoCaja(dto: CreateMovimientoCajaDto) {
    const {
      registroCajaId,
      tipo,
      categoria,
      monto,
      usuarioId,
      descripcion,
      referencia,
      banco,
      numeroBoleta,
      usadoParaCierre,
      proveedorId,
      fecha,
    } = dto;

    if ([tipo, categoria, monto, usuarioId].some((p) => p == null)) {
      throw new BadRequestException('Falta propiedad obligatoria');
    }

    if (tipo === 'DEPOSITO_BANCO' && (!banco || !numeroBoleta)) {
      throw new BadRequestException(
        'Depósito: banco y numeroBoleta son obligatorios',
      );
    }

    if (registroCajaId) {
      const caja = await this.prisma.registroCaja.findUnique({
        where: { id: registroCajaId },
        select: { estado: true },
      });
      if (!caja) throw new BadRequestException('registroCajaId inválido');
      if (caja.estado !== 'ABIERTO') {
        throw new BadRequestException(
          'No se pueden registrar movimientos en una caja cerrada',
        );
      }
    }

    // Construir data sin `connect: null`
    const data: any = {
      tipo,
      categoria,
      monto,
      descripcion,
      referencia,
      banco,
      numeroBoleta,
      usuario: { connect: { id: usuarioId } },
    };

    if (typeof usadoParaCierre === 'boolean')
      data.usadoParaCierre = usadoParaCierre;
    if (registroCajaId) data.registroCaja = { connect: { id: registroCajaId } };
    if (proveedorId) data.proveedor = { connect: { id: proveedorId } };
    if (fecha) data.fecha = dayjs(fecha).tz(TZGT); // ISO 8601

    try {
      return await this.prisma.movimientoCaja.create({ data });
    } catch (error) {
      this.logger.error('Error registrando movimiento:', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Error inesperado al guardar movimiento de caja',
      );
    }
  }

  async getMovimientosPorCaja(cajaId: number): Promise<MovimientoCajaItem[]> {
    if (!cajaId) throw new BadRequestException('cajaId requerido');

    const items = await this.prisma.movimientoCaja.findMany({
      where: { registroCajaId: cajaId },
      orderBy: { fecha: 'desc' },
      select: {
        id: true,
        fecha: true,
        tipo: true,
        categoria: true,
        monto: true,
        descripcion: true,
        referencia: true,
        banco: true,
        numeroBoleta: true,
        usadoParaCierre: true,
        proveedor: { select: { id: true, nombre: true } },
        usuario: { select: { id: true, nombre: true } },
      },
    });

    return items.map((m) => ({
      id: m.id,
      fecha: m.fecha.toISOString(),
      tipo: m.tipo,
      categoria: m.categoria,
      monto: m.monto,
      descripcion: m.descripcion ?? null,
      referencia: m.referencia ?? null,
      banco: m.banco ?? null,
      numeroBoleta: m.numeroBoleta ?? null,
      usadoParaCierre: !!m.usadoParaCierre,
      proveedor: m.proveedor
        ? { id: m.proveedor.id, nombre: m.proveedor.nombre }
        : null,
      usuario: { id: m.usuario.id, nombre: m.usuario.nombre },
    }));
  }

  async getAllMovimientos(): Promise<MovimientoCajaItem[]> {
    const items = await this.prisma.movimientoCaja.findMany({
      orderBy: { fecha: 'desc' },
      select: {
        id: true,
        fecha: true,
        tipo: true,
        categoria: true,
        monto: true,
        descripcion: true,
        referencia: true,
        banco: true,
        numeroBoleta: true,
        usadoParaCierre: true,
        proveedor: { select: { id: true, nombre: true } },
        usuario: { select: { id: true, nombre: true } },
      },
    });

    return items.map((m) => ({
      id: m.id,
      fecha: m.fecha.toISOString(),
      tipo: m.tipo,
      categoria: m.categoria,
      monto: m.monto,
      descripcion: m.descripcion ?? null,
      referencia: m.referencia ?? null,
      banco: m.banco ?? null,
      numeroBoleta: m.numeroBoleta ?? null,
      usadoParaCierre: !!m.usadoParaCierre,
      proveedor: m.proveedor
        ? { id: m.proveedor.id, nombre: m.proveedor.nombre }
        : null,
      usuario: { id: m.usuario.id, nombre: m.usuario.nombre },
    }));
  }
}
