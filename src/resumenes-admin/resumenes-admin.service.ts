import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateResumenesAdminDto } from './dto/create-resumenes-admin.dto';
import { UpdateResumenesAdminDto } from './dto/update-resumenes-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { transformAuthInfo } from 'passport';
import { dayBounds, n } from 'src/cron-snapshoot/helpers';
import * as dayjs from 'dayjs';
import 'dayjs/locale/es';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { TZGT } from 'src/utils/utils';
import { ResumenDiarioAdminResponse } from './interfaces';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale('es');

const num = (v: any) => Number(v ?? 0);
type DayWindow = { inicio: Date; fin: Date; dayStr: string };
const CASH_METHODS = ['EFECTIVO', 'CONTADO', 'CASH', 'CHEQUE']; // ajusta a tu catálogo
function N(v: any): number {
  if (v == null) return 0;
  if (typeof v === 'number') return v;
  if (typeof (v as any).toString === 'function')
    return Number((v as any).toString());
  return Number(v) || 0;
}
@Injectable()
export class ResumenesAdminService {
  private readonly UMBRAL_DESCUADRE = 0.01;
  private readonly logger = new Logger(ResumenesAdminService.name);
  constructor(private readonly prisma: PrismaService) {}

  //HELPERS
  // -------- Helpers --------
  private buildDayRange(
    fromISO: string,
    toISO: string,
    tz: string,
  ): DayWindow[] {
    const a = dayBounds(fromISO, tz).inicio;
    const b = dayBounds(toISO, tz).inicio;

    const days: DayWindow[] = [];
    for (
      let d = new Date(a);
      d.getTime() <= b.getTime();
      d.setDate(d.getDate() + 1)
    ) {
      const inicio = new Date(d);
      const fin = new Date(d);
      fin.setDate(fin.getDate() + 1);
      days.push({
        inicio,
        fin,
        dayStr: inicio.toISOString().slice(0, 10),
      });
    }
    return days;
  }

  private efectivoDesdeMetodos(porMetodo: Record<string, number>) {
    let total = 0;
    for (const k in porMetodo) {
      if (k === 'CONTADO' || k === 'EFECTIVO')
        total += Number(porMetodo[k] ?? 0);
    }
    return total;
  }

  // Heurística para identificar ventas en efectivo a partir de porMetodo
  calcularEfectivoDesdeMetodos(porMetodo: Record<string, number>) {
    let total = 0;
    for (const metodo in porMetodo) {
      switch (metodo) {
        case 'CONTADO':
        case 'EFECTIVO':
          total += Number(porMetodo[metodo] ?? 0);
          break;
        default:
          // no es efectivo en caja
          break;
      }
    }
    return total;
  }

  async panelAdminResumenDiario() {
    try {
    } catch (error) {
      this.logger.error('El error generado es: ', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Fatal Error: Error inesperado');
    }
  }

  async resumenDiarioAdmin(
    sucursalId: number,
    dateISO: string,
  ): Promise<ResumenDiarioAdminResponse> {
    // 1) Día TZ GT [00:00, 23:59:59]
    const day = dayjs.tz(dateISO.slice(0, 10), 'YYYY-MM-DD', TZGT);
    const inicio = day.startOf('day').toDate();
    const fin = day.endOf('day').toDate();

    const whereMov = { sucursalId, fecha: { gte: inicio, lte: fin } } as const;

    // 2) Sumatorias por canal (signo separado)
    const [cajaIn, cajaOut, banIn, banOut] = await Promise.all([
      this.prisma.movimientoFinanciero.aggregate({
        _sum: { deltaCaja: true },
        where: { ...whereMov, deltaCaja: { gt: 0 } },
      }),
      this.prisma.movimientoFinanciero.aggregate({
        _sum: { deltaCaja: true },
        where: { ...whereMov, deltaCaja: { lt: 0 } },
      }),
      this.prisma.movimientoFinanciero.aggregate({
        _sum: { deltaBanco: true },
        where: { ...whereMov, deltaBanco: { gt: 0 } },
      }),
      this.prisma.movimientoFinanciero.aggregate({
        _sum: { deltaBanco: true },
        where: { ...whereMov, deltaBanco: { lt: 0 } },
      }),
    ]);

    const ingresosCaja = N(cajaIn._sum.deltaCaja);
    const egresosCaja = Math.abs(N(cajaOut._sum.deltaCaja));
    const ingresosBanco = N(banIn._sum.deltaBanco);
    const egresosBanco = Math.abs(N(banOut._sum.deltaBanco));

    // 3) Snapshot previo + apertura del día
    const [snapPrev, apertura] = await Promise.all([
      this.prisma.sucursalSaldoDiario.findFirst({
        where: { sucursalId, fecha: { lt: inicio } },
        orderBy: { fecha: 'desc' },
        select: { saldoFinalCaja: true, saldoFinalBanco: true },
      }),
      this.prisma.registroCaja.findFirst({
        where: { sucursalId, fechaApertura: { gte: inicio, lte: fin } },
        orderBy: { fechaApertura: 'asc' },
        select: { saldoInicial: true },
      }),
    ]);

    const inicioCaja = N(
      apertura?.saldoInicial ?? snapPrev?.saldoFinalCaja ?? 0,
    );
    const inicioBanco = N(snapPrev?.saldoFinalBanco ?? 0);

    // 4) Ventas y métodos
    const [ventasAgg, pagosGroup] = await Promise.all([
      this.prisma.venta.aggregate({
        where: { sucursalId, fechaVenta: { gte: inicio, lte: fin } },
        _sum: { totalVenta: true },
        _count: { _all: true },
      }),
      this.prisma.pago.groupBy({
        by: ['metodoPago'],
        where: {
          venta: { is: { sucursalId, fechaVenta: { gte: inicio, lte: fin } } },
        },
        _sum: { monto: true },
      }),
    ]);

    const ventasTotal = N(ventasAgg._sum.totalVenta);
    const ventasCantidad = N(ventasAgg._count._all);
    const ticketPromedio = ventasCantidad ? ventasTotal / ventasCantidad : 0;

    const porMetodo: Record<string, number> = {};
    for (const g of pagosGroup)
      porMetodo[g.metodoPago as string] = N(g._sum.monto);

    // Métodos que cuentan como "efectivo" (catálogo configurable)
    const efectivoVentas = CASH_METHODS.reduce(
      (acc, k) => acc + (porMetodo[k] ?? 0),
      0,
    );

    // 5) Egresos operativos (COSTO_VENTA / GASTO_OPERATIVO) por canal
    const [costosCajaAgg, costosBancoAgg, gastosCajaAgg, gastosBancoAgg] =
      await Promise.all([
        this.prisma.movimientoFinanciero.aggregate({
          _sum: { deltaCaja: true },
          where: {
            ...whereMov,
            clasificacion: 'COSTO_VENTA',
            deltaCaja: { lt: 0 },
          },
        }),
        this.prisma.movimientoFinanciero.aggregate({
          _sum: { deltaBanco: true },
          where: {
            ...whereMov,
            clasificacion: 'COSTO_VENTA',
            deltaBanco: { lt: 0 },
          },
        }),
        this.prisma.movimientoFinanciero.aggregate({
          _sum: { deltaCaja: true },
          where: {
            ...whereMov,
            clasificacion: 'GASTO_OPERATIVO',
            deltaCaja: { lt: 0 },
          },
        }),
        this.prisma.movimientoFinanciero.aggregate({
          _sum: { deltaBanco: true },
          where: {
            ...whereMov,
            clasificacion: 'GASTO_OPERATIVO',
            deltaBanco: { lt: 0 },
          },
        }),
      ]);

    const costosCaja = Math.abs(N(costosCajaAgg._sum.deltaCaja));
    const costosBanco = Math.abs(N(costosBancoAgg._sum.deltaBanco));
    const gastosCaja = Math.abs(N(gastosCajaAgg._sum.deltaCaja));
    const gastosBanco = Math.abs(N(gastosBancoAgg._sum.deltaBanco));

    // Sub-desglose: pagos a proveedor
    const [provCajaAgg, provBancoAgg] = await Promise.all([
      this.prisma.movimientoFinanciero.aggregate({
        _sum: { deltaCaja: true },
        where: {
          ...whereMov,
          clasificacion: 'COSTO_VENTA',
          motivo: { in: ['DEPOSITO_PROVEEDOR', 'PAGO_PROVEEDOR_BANCO'] },
          deltaCaja: { lt: 0 },
        },
      }),
      this.prisma.movimientoFinanciero.aggregate({
        _sum: { deltaBanco: true },
        where: {
          ...whereMov,
          clasificacion: 'COSTO_VENTA',
          motivo: { in: ['DEPOSITO_PROVEEDOR', 'PAGO_PROVEEDOR_BANCO'] },
          deltaBanco: { lt: 0 },
        },
      }),
    ]);
    const pagoProvCaja = Math.abs(N(provCajaAgg._sum.deltaCaja));
    const pagoProvBanco = Math.abs(N(provBancoAgg._sum.deltaBanco));

    // 6) Depósitos de CIERRE (Caja→Banco)
    const [depCount, depSumBanco, depSumCaja, depPorCuenta] = await Promise.all(
      [
        this.prisma.movimientoFinanciero.count({
          where: { ...whereMov, motivo: 'DEPOSITO_CIERRE' },
        }),
        this.prisma.movimientoFinanciero.aggregate({
          _sum: { deltaBanco: true },
          where: {
            ...whereMov,
            motivo: 'DEPOSITO_CIERRE',
            deltaBanco: { gt: 0 },
          },
        }),
        this.prisma.movimientoFinanciero.aggregate({
          _sum: { deltaCaja: true },
          where: {
            ...whereMov,
            motivo: 'DEPOSITO_CIERRE',
            deltaCaja: { lt: 0 },
          },
        }),
        this.prisma.movimientoFinanciero.groupBy({
          by: ['cuentaBancariaId'],
          where: {
            ...whereMov,
            motivo: 'DEPOSITO_CIERRE',
            deltaBanco: { gt: 0 },
          },
          _sum: { deltaBanco: true },
          _count: { _all: true },
        }),
      ],
    );

    const depositoCierreBanco = N(depSumBanco._sum.deltaBanco); // +++
    const depositoCierreCaja = Math.abs(N(depSumCaja._sum.deltaCaja)); // ---
    const cuentaIds = depPorCuenta
      .map((d) => d.cuentaBancariaId)
      .filter(Boolean) as number[];
    const cuentas = cuentaIds.length
      ? await this.prisma.cuentaBancaria.findMany({
          where: { id: { in: cuentaIds } },
          select: { id: true, banco: true, alias: true, numero: true },
        })
      : [];
    const porCuenta = depPorCuenta.map((d) => {
      const c = cuentas.find((x) => x.id === d.cuentaBancariaId);
      return {
        cuentaBancariaId: d.cuentaBancariaId!,
        banco: c?.banco ?? '—',
        alias: c?.alias ?? null,
        numeroMasked: c?.numero ? `****${c.numero.slice(-4)}` : null,
        monto: N(d._sum.deltaBanco),
        cantidad: N(d._count._all),
      };
    });

    // (Opcional) Banco→Caja del día
    const bancoACajaAgg = await this.prisma.movimientoFinanciero.aggregate({
      _sum: { deltaCaja: true },
      where: {
        ...whereMov,
        clasificacion: 'TRANSFERENCIA',
        deltaCaja: { gt: 0 },
        deltaBanco: { lt: 0 },
      },
    });
    const bancoACaja = N(bancoACajaAgg._sum.deltaCaja);

    // 7) Cálculos de saldos y cuadres
    const finalFisicoCaja = inicioCaja + ingresosCaja - egresosCaja;
    const egresosSinCierre = egresosCaja - depositoCierreCaja;
    const finalOperativoCaja = inicioCaja + ingresosCaja - egresosSinCierre;

    const cajaDisponible = inicioCaja + ingresosCaja - egresosSinCierre; // antes de depositar
    const depositoMayorADisponible = depositoCierreCaja > cajaDisponible;

    const finalBanco = inicioBanco + ingresosBanco - egresosBanco;

    const identidadCajaOk =
      Math.abs(finalFisicoCaja - (inicioCaja + ingresosCaja - egresosCaja)) <
      0.001;
    const identidadBancoOk =
      Math.abs(finalBanco - (inicioBanco + ingresosBanco - egresosBanco)) <
      0.001;

    // 7.1) Ingresos de Caja POR VENTAS (para cuadre de ventas)
    const ingCajaVentasAgg = await this.prisma.movimientoFinanciero.aggregate({
      _sum: { deltaCaja: true },
      where: {
        ...whereMov,
        clasificacion: 'INGRESO',
        motivo: 'VENTA',
        deltaCaja: { gt: 0 },
      },
    });
    let ingresosCajaPorVentas = Math.abs(N(ingCajaVentasAgg._sum.deltaCaja));
    let ingresosCajaPorVentasEstimado = false;

    // Fallback: si no registras MF de ventas y sí hay pagos en efectivo,
    // asumimos ingresosCajaPorVentas = efectivoVentas (no duplica si luego registras MF)
    if (ingresosCajaPorVentas === 0 && efectivoVentas > 0) {
      ingresosCajaPorVentas = efectivoVentas;
      ingresosCajaPorVentasEstimado = true;
    }

    // 7.2) Comparativos
    const netoCajaOperativo = ingresosCaja - egresosSinCierre; // informativo
    const variacionVsEfectivo = netoCajaOperativo - efectivoVentas; // informativo

    const deltaVentasCajaVsEfectivo = ingresosCajaPorVentas - efectivoVentas; // semáforo principal de ventas
    const ventasOk = Math.abs(deltaVentasCajaVsEfectivo) <= 0.01;
    const excesoDeposito = Math.max(0, depositoCierreCaja - cajaDisponible);
    const depositoOk = excesoDeposito <= 0.01;

    const alertas: string[] = [];
    if (!ventasOk)
      alertas.push(
        'Ingresos de caja por ventas no coincide con ventas en efectivo',
      );
    if (!depositoOk)
      alertas.push('Depósito de cierre mayor que la caja disponible');
    // Si hubo apertura, snapshot es informativo (no alerta “dura”)
    if (
      !apertura &&
      snapPrev &&
      Math.abs(inicioCaja - N(snapPrev.saldoFinalCaja)) > 0.01
    ) {
      alertas.push('Inicio de caja no coincide con snapshot previo');
    }

    // 8) Respuesta
    return {
      fecha: day.format('YYYY-MM-DD'),
      sucursalId,
      caja: {
        inicio: inicioCaja,
        ingresos: ingresosCaja,
        egresos: egresosCaja,
        finalFisico: finalFisicoCaja,
        egresosSinCierre,
        finalOperativo: finalOperativoCaja,
      },
      banco: {
        inicio: inicioBanco,
        ingresos: ingresosBanco,
        egresos: egresosBanco,
        final: finalBanco,
      },
      ventas: {
        total: ventasTotal,
        cantidad: ventasCantidad,
        ticketPromedio,
        porMetodo,
        efectivo: efectivoVentas,
      },
      egresos: {
        costosVenta: {
          total: costosCaja + costosBanco,
          caja: costosCaja,
          banco: costosBanco,
          pagoProveedor: { caja: pagoProvCaja, banco: pagoProvBanco },
        },
        gastosOperativos: {
          total: gastosCaja + gastosBanco,
          caja: gastosCaja,
          banco: gastosBanco,
        },
      },
      transferencias: {
        depositoCierre: {
          montoBanco: depositoCierreBanco,
          montoCaja: depositoCierreCaja,
          cantidad: depCount,
          porCuenta,
        },
        bancoACaja,
        // ✅ Validaciones útiles para UI
        validaciones: {
          cajaDisponibleAntesDeDepositar: cajaDisponible,
          excesoDeposito,
        },
      },
      comparativos: {
        // (compat)
        netoCajaOperativo,
        efectivoVentas,
        variacionCajaVsVentasEfectivo: variacionVsEfectivo,

        // ✅ Nuevos semáforos claros
        ingresosCajaPorVentas,
        ingresosCajaPorVentasEstimado, // true si usamos fallback
        deltaVentasCajaVsEfectivo,
        ventasOk,

        cajaDisponibleAntesDeDepositar: cajaDisponible,
        depositoCierreCaja,
        excesoDeposito,
        depositoOk,

        alertas,
      },
      diagnostico: {
        snapshotPrevio: {
          caja: N(snapPrev?.saldoFinalCaja) ?? null,
          banco: N(snapPrev?.saldoFinalBanco) ?? null,
        },
        aperturaCaja: N(apertura?.saldoInicial) ?? null,
        chequeos: {
          identidadCajaOk,
          identidadBancoOk,
        },
      },
    };
  }

  async getDepositosGroupBy(sucursalId: number, date?: string) {
    try {
      const dateFilter = date
        ? {
            gte: new Date(date + 'T00:00:00Z'),
            lte: new Date(date + 'T23:59:59Z'),
          }
        : undefined;

      const [depositosProveedores, depositosCierres] = await Promise.all([
        this.prisma.movimientoFinanciero.findMany({
          where: {
            motivo: 'DEPOSITO_PROVEEDOR',
            sucursalId,
            ...(dateFilter ? { creadoEn: dateFilter } : {}),
          },
          select: {
            id: true,
            metodoPago: true,
            creadoEn: true,
            deltaBanco: true,
            deltaCaja: true,
            descripcion: true,
            usuario: { select: { id: true, nombre: true, correo: true } },
            proveedor: { select: { id: true, nombre: true } },
            registroCaja: {
              select: { id: true, fechaApertura: true, fechaCierre: true },
            },
          },
        }),
        this.prisma.movimientoFinanciero.findMany({
          where: {
            motivo: 'DEPOSITO_CIERRE',
            sucursalId,
            ...(dateFilter ? { creadoEn: dateFilter } : {}),
          },
          select: {
            id: true,
            deltaBanco: true,
            deltaCaja: true,
            creadoEn: true,
            cuentaBancaria: {
              select: { banco: true, alias: true, numero: true },
            },
          },
        }),
      ]);

      const totalDepositosProveedores = depositosProveedores.reduce(
        (acc, deposito) => acc + Math.abs(Number(deposito.deltaCaja ?? 0)),
        0,
      );

      const totalDepositosCierres = depositosCierres.reduce(
        (acc, deposito) => acc + Math.abs(Number(deposito.deltaBanco ?? 0)),
        0,
      );

      return {
        totalDepoistosProveedores: {
          montoTotal: totalDepositosProveedores,
          noRegistros: depositosProveedores.length,
        },
        totalDepositosCierres: {
          montoTotal: totalDepositosCierres,
          noRegistros: depositosCierres.length,
        },
        depositosProveedores,
        depositosCierres,
      };
    } catch (error) {
      this.logger.error('El error es: ', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Error al conseguir depositos agrupados',
      );
    }
  }

  /**
   *
   * @param sucursalId ID de la sucursal
   * @returns Todos los datos historicos de los dias pasados en funcion de las fecha dada
   */
  async getGlobalHistorico(sucursalId: number) {
    try {
      const saldosDeDia = await this.prisma.movimientoFinanciero.findMany();
      const [registroCaja, movimientosFinancies] = await Promise.all([
        this.prisma.registroCaja.findMany({}),
        this.prisma.movimientoFinanciero.findMany({}),
      ]);

      return;
    } catch (error) {
      this.logger.error('El error generado es: ', error);

      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Fatal Error:Error inesperado');
    }
  }

  //HISTORICOS POR SUCURSAL Y GLOBAL
  // -------- Público: Histórico por sucursal --------
  async historicoSucursal(params: {
    sucursalId: number;
    from: string;
    to: string;
    tz?: string;
  }) {
    const { sucursalId, from, to, tz = '-06:00' } = params;
    const days = this.buildDayRange(from, to, tz);
    this.logger.debug('La data llegando es: ', sucursalId, from, to);
    // Traemos todos los snapshots del rango para esta sucursal
    const snaps = await this.prisma.sucursalSaldoDiario.findMany({
      where: {
        sucursalId,
        fecha: { gte: days[0].inicio, lt: days[days.length - 1].fin },
      },
      orderBy: { fecha: 'asc' },
      select: {
        id: true,
        fecha: true,
        saldoInicioCaja: true,
        ingresosCaja: true,
        egresosCaja: true,
        saldoFinalCaja: true,
        saldoInicioBanco: true,
        ingresosBanco: true,
        egresosBanco: true,
        saldoFinalBanco: true,
      },
    });

    // Diccionario por 'YYYY-MM-DD'
    const byDay: Record<string, (typeof snaps)[number]> = {};
    for (const s of snaps) {
      const key = s.fecha.toISOString().slice(0, 10);
      byDay[key] = s;
    }

    // Armar cada día (complementos)
    const rows = [];
    for (const d of days) {
      const snap = byDay[d.dayStr] || null;
      const sinSnapshot = !snap;

      // Datos base de caja/banco (0 si no hay snap)
      const baseCaja = {
        inicio: n(snap?.saldoInicioCaja),
        ingresos: n(snap?.ingresosCaja),
        egresos: n(snap?.egresosCaja),
        final: n(snap?.saldoFinalCaja),
      };
      const baseBanco = {
        inicio: n(snap?.saldoInicioBanco),
        ingresos: n(snap?.ingresosBanco),
        egresos: n(snap?.egresosBanco),
        final: n(snap?.saldoFinalBanco),
      };

      // Complementos del día (ventas, egresos, depósitos cierre)
      const [
        ventasAgg,
        pagosGroup,
        costosCaja,
        costosBanco,
        gastosCaja,
        gastosBanco,
        depSumBanco,
        depCount,
        depSumCajaAbs,
      ] = await Promise.all([
        this.prisma.venta.aggregate({
          where: { sucursalId, fechaVenta: { gte: d.inicio, lt: d.fin } },
          _sum: { totalVenta: true },
          _count: { _all: true },
        }),
        this.prisma.pago.groupBy({
          by: ['metodoPago'],
          where: {
            venta: {
              is: { sucursalId, fechaVenta: { gte: d.inicio, lt: d.fin } },
            },
          },
          _sum: { monto: true },
        }),
        this.prisma.movimientoFinanciero.aggregate({
          _sum: { deltaCaja: true },
          where: {
            sucursalId,
            fecha: { gte: d.inicio, lt: d.fin },
            clasificacion: 'COSTO_VENTA',
            deltaCaja: { lt: 0 },
          },
        }),
        this.prisma.movimientoFinanciero.aggregate({
          _sum: { deltaBanco: true },
          where: {
            sucursalId,
            fecha: { gte: d.inicio, lt: d.fin },
            clasificacion: 'COSTO_VENTA',
            deltaBanco: { lt: 0 },
          },
        }),
        this.prisma.movimientoFinanciero.aggregate({
          _sum: { deltaCaja: true },
          where: {
            sucursalId,
            fecha: { gte: d.inicio, lt: d.fin },
            clasificacion: 'GASTO_OPERATIVO',
            deltaCaja: { lt: 0 },
          },
        }),
        this.prisma.movimientoFinanciero.aggregate({
          _sum: { deltaBanco: true },
          where: {
            sucursalId,
            fecha: { gte: d.inicio, lt: d.fin },
            clasificacion: 'GASTO_OPERATIVO',
            deltaBanco: { lt: 0 },
          },
        }),
        this.prisma.movimientoFinanciero.aggregate({
          _sum: { deltaBanco: true },
          where: {
            sucursalId,
            fecha: { gte: d.inicio, lt: d.fin },
            motivo: 'DEPOSITO_CIERRE',
            deltaBanco: { gt: 0 },
          },
        }),
        this.prisma.movimientoFinanciero.count({
          where: {
            sucursalId,
            fecha: { gte: d.inicio, lt: d.fin },
            motivo: 'DEPOSITO_CIERRE',
          },
        }),
        this.prisma.movimientoFinanciero.aggregate({
          _sum: { deltaCaja: true },
          where: {
            sucursalId,
            fecha: { gte: d.inicio, lt: d.fin },
            motivo: 'DEPOSITO_CIERRE',
            deltaCaja: { lt: 0 },
          },
        }),
      ]);

      const ventasTotal = n(ventasAgg._sum.totalVenta);
      const ventasCantidad = n(ventasAgg._count._all);
      const porMetodo: Record<string, number> = {};
      for (const g of pagosGroup)
        porMetodo[g.metodoPago as string] = n(g._sum.monto);

      const efectivoVentas = this.efectivoDesdeMetodos(porMetodo);

      const costosVenta =
        Math.abs(n(costosCaja._sum.deltaCaja)) +
        Math.abs(n(costosBanco._sum.deltaBanco));
      const gastosOperativos =
        Math.abs(n(gastosCaja._sum.deltaCaja)) +
        Math.abs(n(gastosBanco._sum.deltaBanco));
      const depositosCajaABanco = n(depSumBanco._sum.deltaBanco);
      const egresoCajaPorCierre = Math.abs(n(depSumCajaAbs._sum.deltaCaja));

      // Comparativo rápido (misma lógica que en resumen diario)
      const netoCajaOperativo =
        baseCaja.ingresos - (baseCaja.egresos - egresoCajaPorCierre);
      const variacion = netoCajaOperativo - efectivoVentas;
      const descuadre = Math.abs(variacion) > this.UMBRAL_DESCUADRE;

      rows.push({
        fecha: d.dayStr,
        snapshotId: snap?.id ?? null,
        caja: baseCaja,
        banco: baseBanco,
        ventas: {
          total: ventasTotal,
          cantidad: ventasCantidad,
          efectivo: efectivoVentas,
          porMetodo,
        },
        egresos: { costosVenta, gastosOperativos, depositosCajaABanco },
        depositos: { totalMonto: depositosCajaABanco, totalCantidad: depCount },
        flags: { sinSnapshot, descuadreCajaVsEfectivo: descuadre },
        warnings: sinSnapshot ? ['Sin snapshot de cierre para este día'] : [],
      });
    }

    // Period summary
    const sum = rows.reduce(
      (acc, r) => {
        acc.caja.inicio += r.caja.inicio;
        acc.caja.ingresos += r.caja.ingresos;
        acc.caja.egresos += r.caja.egresos;
        acc.caja.final += r.caja.final;

        acc.banco.inicio += r.banco.inicio;
        acc.banco.ingresos += r.banco.ingresos;
        acc.banco.egresos += r.banco.egresos;
        acc.banco.final += r.banco.final;

        acc.ventas.total += r.ventas.total;
        acc.ventas.cantidad += r.ventas.cantidad;
        acc.ventas.efectivo += r.ventas.efectivo;

        acc.egresos.costosVenta += r.egresos.costosVenta;
        acc.egresos.gastosOperativos += r.egresos.gastosOperativos;
        acc.egresos.depositosCajaABanco += r.egresos.depositosCajaABanco;

        acc.depositos.totalMonto += r.depositos.totalMonto;
        acc.depositos.totalCantidad += r.depositos.totalCantidad;

        if (r.flags.sinSnapshot) acc.alerts.add('Faltan snapshots en el rango');
        if (r.flags.descuadreCajaVsEfectivo)
          acc.alerts.add('Descuadres caja vs efectivo en el rango');
        return acc;
      },
      {
        caja: { inicio: 0, ingresos: 0, egresos: 0, final: 0 },
        banco: { inicio: 0, ingresos: 0, egresos: 0, final: 0 },
        ventas: { total: 0, cantidad: 0, efectivo: 0 },
        egresos: {
          costosVenta: 0,
          gastosOperativos: 0,
          depositosCajaABanco: 0,
        },
        depositos: { totalMonto: 0, totalCantidad: 0 },
        alerts: new Set<string>(),
      },
    );

    const periodSummary = {
      caja: sum.caja,
      banco: sum.banco,
      ventas: sum.ventas,
      egresos: sum.egresos,
      depositos: sum.depositos,
      alerts: Array.from(sum.alerts),
    };

    return {
      rango: { from, to, tz },
      sucursalId,
      days: rows,
      periodSummary,
    };
  }

  // -------- Público: Histórico global --------
  async historicoGlobal(params: { from: string; to: string; tz?: string }) {
    const { from, to, tz = '-06:00' } = params;
    const days = this.buildDayRange(from, to, tz);
    this.logger.debug('Los days generados son:', days);
    this.logger.log('Las fechas son: ', from, to, tz);
    const snaps = await this.prisma.saldoGlobalDiario.findMany({
      where: { fecha: { gte: days[0].inicio, lt: days[days.length - 1].fin } },
      orderBy: { fecha: 'asc' },
      select: {
        id: true,
        fecha: true,
        saldoTotalCaja: true,
        ingresosTotalCaja: true,
        egresosTotalCaja: true,
        saldoTotalBanco: true,
        ingresosTotalBanco: true,
        egresosTotalBanco: true,
      },
    });

    const byDay: Record<string, (typeof snaps)[number]> = {};
    for (const s of snaps) byDay[s.fecha.toISOString().slice(0, 10)] = s;

    const rows = days.map((d) => {
      const s = byDay[d.dayStr] || null;
      const sinSnapshot = !s;

      const caja = {
        inicio: 0, // global guarda totales del día; el “inicio” global no es tan útil → dejamos 0
        ingresos: n(s?.ingresosTotalCaja),
        egresos: n(s?.egresosTotalCaja),
        final: n(s?.saldoTotalCaja),
      };
      const banco = {
        inicio: 0,
        ingresos: n(s?.ingresosTotalBanco),
        egresos: n(s?.egresosTotalBanco),
        final: n(s?.saldoTotalBanco),
      };

      return {
        fecha: d.dayStr,
        snapshotId: s?.id ?? null,
        caja,
        banco,
        flags: { sinSnapshot },
      };
    });

    const sum = rows.reduce(
      (acc, r) => {
        acc.caja.ingresos += r.caja.ingresos;
        acc.caja.egresos += r.caja.egresos;
        acc.caja.final += r.caja.final;
        acc.banco.ingresos += r.banco.ingresos;
        acc.banco.egresos += r.banco.egresos;
        acc.banco.final += r.banco.final;
        return acc;
      },
      {
        caja: { inicio: 0, ingresos: 0, egresos: 0, final: 0 },
        banco: { inicio: 0, ingresos: 0, egresos: 0, final: 0 },
      },
    );

    // Ranking simple por sucursal (opcional)
    const topSucursalesRaw = await this.prisma.sucursalSaldoDiario.groupBy({
      by: ['sucursalId'],
      where: { fecha: { gte: days[0].inicio, lt: days[days.length - 1].fin } },
      _sum: { saldoFinalCaja: true, saldoFinalBanco: true },
      orderBy: { _sum: { saldoFinalBanco: 'desc' } },
      take: 10,
    });
    const topSucursales = topSucursalesRaw.map((r) => ({
      sucursalId: r.sucursalId,
      cajaFinal: n(r._sum.saldoFinalCaja),
      bancoFinal: n(r._sum.saldoFinalBanco),
    }));

    return {
      rango: { from, to, tz },
      days: rows,
      periodSummary: sum,
      topSucursales,
    };
  }
}
