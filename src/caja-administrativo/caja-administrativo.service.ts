import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateCajaAdministrativoDto } from './dto/create-caja-administrativo.dto';
import { UpdateCajaAdministrativoDto } from './dto/update-caja-administrativo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CapitalInicialQueryDto,
  CapitalInicialResponse,
} from './dto/capital-inicial.dto';
import { TZGT } from 'src/utils/utils';
import * as dayjs from 'dayjs';
import 'dayjs/locale/es';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale('es');

@Injectable()
export class CajaAdministrativoService {
  private readonly logger = new Logger(CajaAdministrativoService.name);
  constructor(private readonly prisma: PrismaService) {}

  async getCapitalInicialSugerido(
    q: CapitalInicialQueryDto,
  ): Promise<CapitalInicialResponse> {
    const sucursalId = Number(q.sucursalId);
    if (!sucursalId || Number.isNaN(sucursalId)) {
      throw new BadRequestException('sucursalId inválido');
    }
    const ajustarDepositos = q.ajustarDepositosCierre ?? true;

    const aperturaDia = q.fecha ? dayjs.tz(q.fecha, TZGT) : dayjs().tz(TZGT);
    const aperturaStart = aperturaDia.startOf('day').toDate();

    // 1) Último cierre previo a la fecha
    const lastClosed = await this.prisma.registroCaja.findFirst({
      where: {
        sucursalId,
        estado: 'CERRADO',
        fechaApertura: { lt: aperturaStart },
      },
      orderBy: { fechaCierre: 'desc' },
      select: {
        id: true,
        fechaCierre: true,
        saldoFinal: true,
        fondoFijo: true,
        depositado: true,
      },
    });

    if (!lastClosed) {
      return {
        sucursalId,
        fecha: aperturaStart.toISOString(),
        saldoInicialSugerido: 0,
        criterio: 'SIN_CIERRE_PREVIO',
        contexto: {
          ultimoCierreId: null,
          ultimoCierreFecha: null,
          saldoFinalAnterior: null,
          fondoFijoAnterior: null,
          depositoCierreDetectado: false,
        },
      };
    }

    // 2) ¿Hubo depósito de cierre entre el cierre y la nueva apertura?
    let depositoCierreDetectado = false;
    if (ajustarDepositos) {
      const agg = await this.prisma.movimientoFinanciero.aggregate({
        _sum: { deltaCaja: true },
        where: {
          sucursalId,
          esDepositoCierre: true,
          fecha: {
            gt: lastClosed.fechaCierre ?? lastClosed['fechaApertura'],
            lt: aperturaStart,
          },
        },
      });
      const sumDeltaCaja = Number(agg._sum.deltaCaja ?? 0);
      depositoCierreDetectado =
        Math.abs(sumDeltaCaja) > 0 || !!lastClosed.depositado;
    }

    // 3) Criterio de sugerencia
    const saldoFinalAnterior = Number(lastClosed.saldoFinal ?? 0);
    const fondoFijoAnterior = Number(lastClosed.fondoFijo ?? 0);

    const usarFondoFijo = depositoCierreDetectado;
    const saldoInicialSugerido = usarFondoFijo
      ? fondoFijoAnterior
      : saldoFinalAnterior;

    return {
      sucursalId,
      fecha: aperturaStart.toISOString(),
      saldoInicialSugerido,
      criterio: usarFondoFijo
        ? 'FONDO_FIJO_POR_DEPOSITO'
        : 'ARRASTRE_SALDO_FINAL',
      contexto: {
        ultimoCierreId: lastClosed.id,
        ultimoCierreFecha:
          (lastClosed.fechaCierre as Date | null)?.toISOString?.() ?? null,
        saldoFinalAnterior,
        fondoFijoAnterior,
        depositoCierreDetectado,
      },
    };
  }

  async getFlujoSucursal(dto: {
    sucursalId: number;
    from: string;
    to: string;
  }) {
    const { sucursalId, from, to } = dto;

    // Aseguramos que sean fechas válidas
    const fromDate = dayjs(from).tz(TZGT).startOf('day').toDate();
    const toDate = dayjs(to).tz(TZGT).endOf('day').toDate();

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      throw new BadRequestException('Rango de fechas inválido');
    }

    const rows = await this.prisma.sucursalSaldoDiario.findMany({
      where: {
        sucursalId,
        fecha: {
          gte: fromDate,
          lte: toDate,
        },
      },
      orderBy: { fecha: 'asc' },
    });

    return rows.map((r) => ({
      fecha: r.fecha.toISOString(),
      saldoInicioCaja: Number(r.saldoInicioCaja),
      ingresosCaja: Number(r.ingresosCaja),
      egresosCaja: Number(r.egresosCaja),
      saldoFinalCaja: Number(r.saldoFinalCaja),
      saldoInicioBanco: Number(r.saldoInicioBanco),
      ingresosBanco: Number(r.ingresosBanco),
      egresosBanco: Number(r.egresosBanco),
      saldoFinalBanco: Number(r.saldoFinalBanco),
    }));
  }

  async getFlujoGlobal(dto: { from: Date; to: Date }) {
    const rows = await this.prisma.saldoGlobalDiario.findMany({
      where: { fecha: { gte: dto.from, lte: dto.to } },
      orderBy: { fecha: 'asc' },
    });

    return rows.map((r) => ({
      fecha: r.fecha,
      saldoTotalCaja: Number(r.saldoTotalCaja),
      ingresosTotalCaja: Number(r.ingresosTotalCaja),
      egresosTotalCaja: Number(r.egresosTotalCaja),
      saldoTotalBanco: Number(r.saldoTotalBanco),
      ingresosTotalBanco: Number(r.ingresosTotalBanco),
      egresosTotalBanco: Number(r.egresosTotalBanco),
    }));
  }

  async getCostosVentaHistorico(dto: {
    sucursalId?: number;
    from?: string;
    to?: string;
  }) {
    const { sucursalId, from, to } = dto;

    // Validación de fechas
    const fechaFrom = from
      ? dayjs(from).tz('America/Guatemala').startOf('day').toDate()
      : undefined;
    const fechaTo = to
      ? dayjs(to).tz('America/Guatemala').endOf('day').toDate()
      : undefined;

    const rows = await this.prisma.movimientoFinanciero.findMany({
      where: {
        clasificacion: 'COSTO_VENTA',
        ...(sucursalId ? { sucursalId } : {}),
        ...(fechaFrom || fechaTo
          ? {
              fecha: {
                ...(fechaFrom ? { gte: fechaFrom } : {}),
                ...(fechaTo ? { lte: fechaTo } : {}),
              },
            }
          : {}),
      },
      orderBy: { fecha: 'asc' },
      include: {
        sucursal: { select: { id: true, nombre: true } },
        proveedor: { select: { id: true, nombre: true } },
      },
    });

    // --- DETALLE
    const detalle = rows.map((r) => {
      const monto = Math.abs(Number(r.deltaCaja) + Number(r.deltaBanco));
      return {
        id: r.id,
        fecha: r.fecha.toISOString(),
        sucursal: r.sucursal
          ? { id: r.sucursal.id, nombre: r.sucursal.nombre }
          : null,
        proveedor: r.proveedor
          ? { id: r.proveedor.id, nombre: r.proveedor.nombre }
          : null,
        clasificacion: r.clasificacion,
        motivo: r.motivo,
        costoVentaTipo: r.costoVentaTipo,
        monto,
        deltaCaja: Number(r.deltaCaja),
        deltaBanco: Number(r.deltaBanco),
        descripcion: r.descripcion ?? '',
        referencia: r.referencia ?? '',
        conFactura: r.conFactura ?? false,
      };
    });

    // --- RESUMEN GENERAL
    const resumen = detalle.reduce(
      (acc, r) => {
        acc.totalGeneral += r.monto;
        switch (r.costoVentaTipo) {
          case 'MERCADERIA':
            acc.mercaderia += r.monto;
            break;
          case 'FLETE':
            acc.fletes += r.monto;
            break;
          case 'ENCOMIENDA':
            acc.encomiendas += r.monto;
            break;
          case 'TRANSPORTE':
            acc.transporte += r.monto;
            break;
          default:
            acc.otros += r.monto;
        }
        return acc;
      },
      {
        totalGeneral: 0,
        mercaderia: 0,
        fletes: 0,
        encomiendas: 0,
        transporte: 0,
        otros: 0,
      },
    );

    // --- AGRUPADO POR DÍA
    const porDia: Record<
      string,
      {
        fecha: string;
        total: number;
        mercaderia: number;
        fletes: number;
        encomiendas: number;
        transporte: number;
        otros: number;
      }
    > = {};

    detalle.forEach((r) => {
      const dia = dayjs(r.fecha).tz('America/Guatemala').format('YYYY-MM-DD');
      if (!porDia[dia]) {
        porDia[dia] = {
          fecha: dia,
          total: 0,
          mercaderia: 0,
          fletes: 0,
          encomiendas: 0,
          transporte: 0,
          otros: 0,
        };
      }
      porDia[dia].total += r.monto;
      switch (r.costoVentaTipo) {
        case 'MERCADERIA':
          porDia[dia].mercaderia += r.monto;
          break;
        case 'FLETE':
          porDia[dia].fletes += r.monto;
          break;
        case 'ENCOMIENDA':
          porDia[dia].encomiendas += r.monto;
          break;
        case 'TRANSPORTE':
          porDia[dia].transporte += r.monto;
          break;
        default:
          porDia[dia].otros += r.monto;
      }
    });

    return {
      detalle,
      resumen,
      porDia: Object.values(porDia).sort((a, b) =>
        a.fecha.localeCompare(b.fecha),
      ),
    };
  }

  /**
   *
   * @param dto sucursal, form y to
   * @returns Gastos operativos por fechas
   */
  async getGastosOperativos(dto: {
    sucursalId?: number;
    from: Date;
    to: Date;
  }) {
    const { sucursalId, from, to } = dto;
    const fechaFrom = from
      ? dayjs(from).tz('America/Guatemala').startOf('day').toDate()
      : undefined;
    const fechaTo = to
      ? dayjs(to).tz('America/Guatemala').endOf('day').toDate()
      : undefined;
    // 1) Movimientos clasificados como GASTO_OPERATIVO
    const rows = await this.prisma.movimientoFinanciero.findMany({
      where: {
        clasificacion: 'GASTO_OPERATIVO',
        fecha: {
          gte: fechaFrom,
          lte: fechaTo,
        },
        ...(sucursalId ? { sucursalId } : {}),
      },
      orderBy: { fecha: 'asc' },
      select: {
        id: true,
        fecha: true,
        sucursal: { select: { id: true, nombre: true } },
        proveedor: { select: { id: true, nombre: true } },
        motivo: true,
        gastoOperativoTipo: true,
        deltaCaja: true,
        deltaBanco: true,
        descripcion: true,
        referencia: true,
        conFactura: true,
      },
    });

    this.logger.log('Las rows son: ', rows);

    // 2) Mapear detalle
    const detalle = rows.map((r) => ({
      id: r.id,
      fecha: r.fecha.toISOString(),
      sucursal: r.sucursal,
      proveedor: r.proveedor,
      motivo: r.motivo,
      tipo: r.gastoOperativoTipo,
      monto: Math.abs(Number(r.deltaCaja) + Number(r.deltaBanco)),
      deltaCaja: Number(r.deltaCaja),
      deltaBanco: Number(r.deltaBanco),
      descripcion: r.descripcion,
      referencia: r.referencia,
      conFactura: r.conFactura ?? false,
    }));

    // 3) Resumen por categoría
    const resumen = detalle.reduce(
      (acc, d) => {
        const tipo = d.tipo ?? 'OTROS';
        acc.totalGeneral += d.monto;
        acc[tipo] = (acc[tipo] ?? 0) + d.monto;
        return acc;
      },
      { totalGeneral: 0 } as Record<string, number>,
    );

    // 4) Agrupado por día
    const porDiaMap = new Map<string, any>();
    for (const d of detalle) {
      const fechaKey = d.fecha.substring(0, 10); // YYYY-MM-DD
      if (!porDiaMap.has(fechaKey)) {
        porDiaMap.set(fechaKey, { fecha: fechaKey, total: 0 });
      }
      const row = porDiaMap.get(fechaKey);
      row.total += d.monto;
      const tipo = d.tipo ?? 'OTROS';
      row[tipo] = (row[tipo] ?? 0) + d.monto;
    }
    const porDia = Array.from(porDiaMap.values());

    return { detalle, resumen, porDia };
  }

  /**
   *
   * @param dto Sucursal ID, from y to
   * @returns Historicos de flujo de efectivos
   */
  async getFlujoEfectivo(dto: { sucursalId?: number; from: Date; to: Date }) {
    const { sucursalId, from, to } = dto;
    const fechaFrom = from
      ? dayjs(from).tz('America/Guatemala').startOf('day').toDate()
      : undefined;
    const fechaTo = to
      ? dayjs(to).tz('America/Guatemala').endOf('day').toDate()
      : undefined;
    // 1) Traer movimientos del periodo
    const movimientos = await this.prisma.movimientoFinanciero.findMany({
      where: {
        ...(sucursalId ? { sucursalId } : {}),
        fecha: { gte: fechaFrom, lte: fechaTo },
      },
      orderBy: { fecha: 'asc' },
      include: {
        sucursal: { select: { id: true, nombre: true } },
      },
    });

    // 2) Mapear detalle
    const detalle = movimientos.map((m) => {
      const monto = Number(m.deltaCaja ?? 0) + Number(m.deltaBanco ?? 0);
      return {
        id: m.id,
        fecha: m.fecha.toISOString(),
        sucursal: m.sucursal,
        clasificacion: m.clasificacion,
        motivo: m.motivo,
        deltaCaja: Number(m.deltaCaja ?? 0),
        deltaBanco: Number(m.deltaBanco ?? 0),
        monto: Math.abs(monto),
        descripcion: m.descripcion ?? '',
        referencia: m.referencia ?? '',
      };
    });

    // 3) Agrupar por día
    const porDiaMap: Record<string, any> = {};
    for (const d of detalle) {
      const dia = d.fecha.slice(0, 10); // YYYY-MM-DD
      if (!porDiaMap[dia]) {
        porDiaMap[dia] = {
          fecha: dia,
          ingresosCaja: 0,
          egresosCaja: 0,
          ingresosBanco: 0,
          egresosBanco: 0,
          saldoFinalCaja: 0,
          saldoFinalBanco: 0,
          saldoFinalTotal: 0,
        };
      }

      if (d.deltaCaja > 0) porDiaMap[dia].ingresosCaja += d.deltaCaja;
      if (d.deltaCaja < 0) porDiaMap[dia].egresosCaja += Math.abs(d.deltaCaja);

      if (d.deltaBanco > 0) porDiaMap[dia].ingresosBanco += d.deltaBanco;
      if (d.deltaBanco < 0)
        porDiaMap[dia].egresosBanco += Math.abs(d.deltaBanco);

      porDiaMap[dia].saldoFinalCaja += d.deltaCaja;
      porDiaMap[dia].saldoFinalBanco += d.deltaBanco;
      porDiaMap[dia].saldoFinalTotal += d.deltaCaja + d.deltaBanco;
    }

    const porDia = Object.values(porDiaMap);

    // 4) Resumen del periodo
    const resumen = porDia.reduce(
      (acc, d: any) => {
        acc.ingresosCaja += d.ingresosCaja;
        acc.egresosCaja += d.egresosCaja;
        acc.ingresosBanco += d.ingresosBanco;
        acc.egresosBanco += d.egresosBanco;
        acc.saldoNetoCaja += d.saldoFinalCaja;
        acc.saldoNetoBanco += d.saldoFinalBanco;
        return acc;
      },
      {
        ingresosCaja: 0,
        egresosCaja: 0,
        ingresosBanco: 0,
        egresosBanco: 0,
        saldoNetoCaja: 0,
        saldoNetoBanco: 0,
        saldoNetoTotal: 0,
      },
    );

    resumen.saldoNetoTotal = resumen.saldoNetoCaja + resumen.saldoNetoBanco;

    return { resumen, porDia, detalle };
  }
}
