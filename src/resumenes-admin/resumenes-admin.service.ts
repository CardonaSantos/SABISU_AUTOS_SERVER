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
const num = (v: any) => Number(v ?? 0);
type DayWindow = { inicio: Date; fin: Date; dayStr: string };

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

  async resumenDiarioAdmin(sucursalId: number, dateISO: string) {
    this.logger.log('Solicitando con: ', sucursalId);
    this.logger.log('El ISOString es: ', dateISO);

    const dayStr = dateISO.slice(0, 10) ?? new Date(); // "YYYY-MM-DD"
    const inicio = new Date(`${dayStr}T00:00:00-06:00`); // GT -06:00
    const fin = new Date(`${dayStr}T00:00:00-06:00`);
    fin.setDate(fin.getDate() + 1);

    // const whereMov = { sucursalId, fecha: { gte: inicio, lt: fin } } as const;
    const whereMov = { sucursalId, fecha: { gte: inicio, lt: fin } } as const;

    // 1) Caja y Banco (entradas / salidas)
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

    const ingresosCaja = num(cajaIn._sum.deltaCaja);
    const egresosCaja = Math.abs(num(cajaOut._sum.deltaCaja));
    const ingresosBanco = num(banIn._sum.deltaBanco);
    const egresosBanco = Math.abs(num(banOut._sum.deltaBanco));

    // 2) Saldos de inicio (snapshots del día anterior)
    // const snapPrev = await this.prisma.sucursalSaldoDiario.findFirst({
    //   where: { sucursalId, fecha: { lt: inicio } },
    //   orderBy: { fecha: 'desc' },
    //   select: { saldoFinalCaja: true, saldoFinalBanco: true },
    // });

    const snapPrev = await this.prisma.sucursalSaldoDiario.findFirst({
      where: { sucursalId, fecha: { lt: inicio } },
      orderBy: { fecha: 'desc' },
      select: { saldoFinalCaja: true, saldoFinalBanco: true },
    });

    //     const primeraApertura = await this.prisma.registroCaja.findFirst({
    //   where: { sucursalId, fechaApertura: { gte: inicio, lt: fin } },
    //   orderBy: { fechaCierre: 'asc' },
    //   select: { saldoInicial: true },
    // });

    const primeraApertura = await this.prisma.registroCaja.findFirst({
      where: { sucursalId, fechaApertura: { gte: inicio, lt: fin } },
      orderBy: { fechaApertura: 'asc' }, // ✅ apertura, no cierre
      select: { saldoInicial: true },
    });

    // const inicioCaja = primeraApertura ? Number(primeraApertura.saldoInicial ?? 0): snapPrev.saldoFinalBanco
    // const inicioBanco = num(snapPrev?.saldoFinalBanco);
    const inicioCaja = Number(
      primeraApertura?.saldoInicial ?? snapPrev?.saldoFinalCaja ?? 0,
    );

    const inicioBanco = Number(snapPrev?.saldoFinalBanco ?? 0);

    // 3) Ventas y métodos de pago
    const [ventasAgg, pagosGroup] = await Promise.all([
      this.prisma.venta.aggregate({
        where: { sucursalId, fechaVenta: { gte: inicio, lt: fin } },
        _sum: { totalVenta: true },
        _count: { _all: true },
      }),
      this.prisma.pago.groupBy({
        by: ['metodoPago'],
        where: {
          venta: { is: { sucursalId, fechaVenta: { gte: inicio, lt: fin } } },
        },
        _sum: { monto: true },
      }),
    ]);

    const ventasTotal = num(ventasAgg._sum.totalVenta);
    const ventasCantidad = num(ventasAgg._count._all);
    const ticketPromedio = ventasCantidad ? ventasTotal / ventasCantidad : 0;

    const porMetodo: Record<string, number> = {};
    for (const g of pagosGroup)
      porMetodo[g.metodoPago as string] = num(g._sum.monto);
    const efectivoVentas = this.calcularEfectivoDesdeMetodos(porMetodo);

    // 4) Egresos (costos de venta / gastos operativos)
    const [costosCaja, costosBanco, gastosCaja, gastosBanco] =
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

    const costosVentaCaja = Math.abs(num(costosCaja._sum.deltaCaja));
    const costosVentaBanco = Math.abs(num(costosBanco._sum.deltaBanco));
    const costosVentaTotal = costosVentaCaja + costosVentaBanco;

    const gastosOpCaja = Math.abs(num(gastosCaja._sum.deltaCaja));
    const gastosOpBanco = Math.abs(num(gastosBanco._sum.deltaBanco));
    const gastosOperativosTotal = gastosOpCaja + gastosOpBanco;

    // Sub-desglose: pago a proveedor (va dentro de costos de venta)
    // Nota: ajusta los motivos según tu enumeración real en DB
    const motivoPagoProveedor = {
      in: ['DEPOSITO_PROVEEDOR', 'PAGO_PROVEEDOR_BANCO'],
    } as const;
    const [pagoProvCajaAgg, pagoProvBanAgg] = await Promise.all([
      this.prisma.movimientoFinanciero.aggregate({
        _sum: { deltaCaja: true },
        where: {
          ...whereMov,
          motivo: {
            in: ['DEPOSITO_PROVEEDOR', 'PAGO_PROVEEDOR_BANCO'],
          },
          deltaCaja: { lt: 0 },
        },
      }),
      this.prisma.movimientoFinanciero.aggregate({
        _sum: { deltaBanco: true },
        where: {
          ...whereMov,
          motivo: {
            in: ['DEPOSITO_PROVEEDOR', 'PAGO_PROVEEDOR_BANCO'],
          },
          deltaBanco: { lt: 0 },
        },
      }),
    ]);
    const pagoProveedorCaja = Math.abs(num(pagoProvCajaAgg._sum.deltaCaja));
    const pagoProveedorBanco = Math.abs(num(pagoProvBanAgg._sum.deltaBanco));

    // 5) Depósitos SOLO de cierre (ingresan a TU banco)
    const depositoCierreWhereBanco = {
      ...whereMov,
      motivo: 'DEPOSITO_CIERRE',
      deltaBanco: { gt: 0 },
    } as const;
    const depositoCierreWhereCaja = {
      ...whereMov,
      motivo: 'DEPOSITO_CIERRE',
      deltaCaja: { lt: 0 },
    } as const;

    const [depCount, depSumBanco, depSumCajaAbs, depPorCuenta] =
      await Promise.all([
        this.prisma.movimientoFinanciero.count({
          where: { ...whereMov, motivo: 'DEPOSITO_CIERRE' },
        }),
        this.prisma.movimientoFinanciero.aggregate({
          _sum: { deltaBanco: true },
          where: depositoCierreWhereBanco,
        }),
        this.prisma.movimientoFinanciero.aggregate({
          _sum: { deltaCaja: true },
          where: depositoCierreWhereCaja,
        }),
        this.prisma.movimientoFinanciero.groupBy({
          by: ['cuentaBancariaId'],
          where: depositoCierreWhereBanco,
          _sum: { deltaBanco: true },
          _count: { _all: true },
        }),
      ]);

    const depositosTotalMontoBanco = num(depSumBanco._sum.deltaBanco);
    const egresoCajaPorCierre = Math.abs(num(depSumCajaAbs._sum.deltaCaja)); // para comparativos

    // Enriquecer porCuenta con datos de la cuenta
    const cuentaIds = depPorCuenta
      .map((d) => d.cuentaBancariaId)
      .filter(Boolean) as number[];
    const cuentas = cuentaIds.length
      ? await this.prisma.cuentaBancaria.findMany({
          where: { id: { in: cuentaIds } },
          select: { id: true, banco: true, alias: true, numero: true },
        })
      : [];

    const depositosPorCuenta = depPorCuenta.map((d) => {
      const cta = cuentas.find((c) => c.id === d.cuentaBancariaId);
      const numeroMasked = cta?.numero ? `****${cta.numero.slice(-4)}` : null;
      return {
        cuentaBancariaId: d.cuentaBancariaId!,
        banco: cta?.banco ?? '—',
        alias: cta?.alias ?? null,
        numeroMasked,
        monto: num(d._sum.deltaBanco),
        cantidad: num(d._count?._all),
      };
    });

    // 6) Comparativos (cuadre rápido caja vs ventas en efectivo)
    const netoCajaOperativo =
      ingresosCaja - (egresosCaja - egresoCajaPorCierre);
    const variacionCajaVsVentasEfectivo = netoCajaOperativo - efectivoVentas;
    const alertas: string[] = [];
    const UMBRAL_DESCUADRE = 0.01; // ajustable (en moneda, o podrías usar % sobre ventas)
    if (Math.abs(variacionCajaVsVentasEfectivo) > UMBRAL_DESCUADRE) {
      alertas.push('Descuadre caja vs ventas en efectivo');
    }

    // 7) Cierre/Arrastre
    const huboCierre = depCount > 0;

    const cajaFinal =
      inicioCaja + ingresosCaja - (egresosCaja - egresoCajaPorCierre);

    const bancoFinal = inicioBanco + ingresosBanco - egresosBanco;

    // (Opcional) añade un bloque de diagnóstico en la respuesta:
    const debugInicio = {
      porApertura: primeraApertura?.saldoInicial ?? null,
      porSnapshot: snapPrev?.saldoFinalCaja ?? null,
      usado: inicioCaja,
    };
    this.logger.log('El debug opcional diuce: ', debugInicio);
    return {
      fecha: inicio.toISOString().slice(0, 10),
      sucursalId,
      caja: {
        inicio: inicioCaja,
        ingresos: ingresosCaja,
        egresos: egresosCaja,
        final: cajaFinal,
      },
      banco: {
        inicio: inicioBanco,
        ingresos: ingresosBanco,
        egresos: egresosBanco,
        final: bancoFinal,
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
          total: costosVentaTotal,
          caja: costosVentaCaja,
          banco: costosVentaBanco,
          pagoProveedor: {
            caja: pagoProveedorCaja,
            banco: pagoProveedorBanco,
          },
        },
        gastosOperativos: {
          total: gastosOperativosTotal,
          caja: gastosOpCaja,
          banco: gastosOpBanco,
        },
        depositosCajaABanco: depositosTotalMontoBanco, // SOLO DEPOSITO_CIERRE
      },
      depositos: {
        totalMonto: depositosTotalMontoBanco,
        totalCantidad: depCount,
        porTipo: {
          CIERRE_CAJA: {
            monto: depositosTotalMontoBanco,
            cantidad: depCount,
          },
        },
        porCuenta: depositosPorCuenta,
      },
      comparativos: {
        netoCajaOperativo,
        efectivoVentas,
        variacionCajaVsVentasEfectivo,
        alertas,
      },
      cierre: {
        huboCierre,
        montoDepositadoCierre: depositosTotalMontoBanco,
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
