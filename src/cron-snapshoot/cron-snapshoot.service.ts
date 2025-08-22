import { Injectable, Logger } from '@nestjs/common';
import { CreateCronSnapshootDto } from './dto/create-cron-snapshoot.dto';
import { UpdateCronSnapshootDto } from './dto/update-cron-snapshoot.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { dayBounds, n } from './helpers';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CronSnapshootService {
  private readonly logger = new Logger(CronSnapshootService.name);
  constructor(private readonly prisma: PrismaService) {}
  private readonly TZ = '-06:00'; // Guatemala

  @Cron(CronExpression.EVERY_11_HOURS)
  async CronCreateCierreSucursalDia() {
    this.cronCierreAyer();

    const snapshotDia = await this.generarSnapshotSucursalDia(1, '2025-08-22'); // sucursal 1, hoy
    const snapshootGloabal = await this.generarSnapshotGlobalDia('2025-08-22');

    this.logger.log('Snapshoot del dia es: ', snapshotDia);
    this.logger.log('snapshootGloabal del dia es: ', snapshootGloabal);
  }

  /**
   * Cron: cierra "ayer" para TODAS las sucursales y genera el global del día.
   * Idempotente: si ya existe snapshot, se actualiza.
   */
  async cronCierreAyer() {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() - 1);
    const dateISO = hoy.toISOString().slice(0, 10); // YYYY-MM-DD

    this.logger.log(`⏰ Cron cierre para fecha ${dateISO}`);

    const sucursales = await this.prisma.sucursal.findMany({
      select: { id: true },
    });

    // Cerrar por sucursal en paralelo controlado
    await Promise.all(
      sucursales.map((s) =>
        this.generarSnapshotSucursalDia(s.id, dateISO, this.TZ),
      ),
    );

    // Global del día
    const globalSaldo = await this.generarSnapshotGlobalDia(dateISO, this.TZ);
    this.logger.log('Global generado: ', globalSaldo);

    this.logger.log(`✅ Cron cierre completado para ${dateISO}`);
    return { ok: true, dateISO, sucursales: sucursales.length };
  }

  /**
   * Genera o actualiza el snapshot del día para una sucursal (idempotente).
   * - fecha normalizada a 00:00:00 -06:00 (GT)
   * - calcula saldos de inicio desde snapshot previo + delta movimientos hasta el inicio
   * - suma ingresos/egresos del día y cierra saldos finales
   */
  async generarSnapshotSucursalDia(
    sucursalId: number,
    dateISO: string,
    tz = '-06:00',
  ) {
    const { inicio, fin } = dayBounds(dateISO, tz);

    return this.prisma.$transaction(async (tx) => {
      // 1) Snapshot previo (el último antes del día)
      const prev = await tx.sucursalSaldoDiario.findFirst({
        where: { sucursalId, fecha: { lt: inicio } },
        orderBy: { fecha: 'desc' },
        select: { saldoFinalCaja: true, saldoFinalBanco: true },
      });

      // 2) Fallback de apertura si NO hay snapshot previo (primer día)
      const apertura = await tx.registroCaja.findFirst({
        where: { sucursalId, fechaApertura: { gte: inicio, lt: fin } },
        orderBy: { fechaApertura: 'asc' },
        select: { saldoInicial: true },
      });

      // 3) Saldos de inicio (NO sumar "deltaPrev" al snapshot previo)
      const saldoInicioCaja = prev
        ? n(prev.saldoFinalCaja)
        : n(apertura?.saldoInicial); // si tampoco hay apertura, será 0
      const saldoInicioBanco = prev ? n(prev.saldoFinalBanco) : 0; // o capital inicial banco si lo manejas

      // 4) Movimientos del día
      const [cajaIn, cajaOut, banIn, banOut] = await Promise.all([
        tx.movimientoFinanciero.aggregate({
          _sum: { deltaCaja: true },
          where: {
            sucursalId,
            fecha: { gte: inicio, lt: fin },
            deltaCaja: { gt: 0 },
          },
        }),
        tx.movimientoFinanciero.aggregate({
          _sum: { deltaCaja: true },
          where: {
            sucursalId,
            fecha: { gte: inicio, lt: fin },
            deltaCaja: { lt: 0 },
          },
        }),
        tx.movimientoFinanciero.aggregate({
          _sum: { deltaBanco: true },
          where: {
            sucursalId,
            fecha: { gte: inicio, lt: fin },
            deltaBanco: { gt: 0 },
          },
        }),
        tx.movimientoFinanciero.aggregate({
          _sum: { deltaBanco: true },
          where: {
            sucursalId,
            fecha: { gte: inicio, lt: fin },
            deltaBanco: { lt: 0 },
          },
        }),
      ]);

      const ingresosCaja = n(cajaIn._sum.deltaCaja);
      const egresosCaja = Math.abs(n(cajaOut._sum.deltaCaja));
      const ingresosBanco = n(banIn._sum.deltaBanco);
      const egresosBanco = Math.abs(n(banOut._sum.deltaBanco));

      const saldoFinalCaja = saldoInicioCaja + ingresosCaja - egresosCaja;
      const saldoFinalBanco = saldoInicioBanco + ingresosBanco - egresosBanco;

      // 5) Upsert idempotente
      const snap = await tx.sucursalSaldoDiario.upsert({
        where: { sucursalId_fecha: { sucursalId, fecha: inicio } },
        update: {
          saldoInicioCaja,
          ingresosCaja,
          egresosCaja,
          saldoFinalCaja,
          saldoInicioBanco,
          ingresosBanco,
          egresosBanco,
          saldoFinalBanco,
        },
        create: {
          sucursalId,
          fecha: inicio,
          saldoInicioCaja,
          ingresosCaja,
          egresosCaja,
          saldoFinalCaja,
          saldoInicioBanco,
          ingresosBanco,
          egresosBanco,
          saldoFinalBanco,
        },
      });

      // (Opcional) logging de diagnóstico
      // this.logger.log({ inicio, sucursalId, saldoInicioCaja, ingresosCaja, egresosCaja, saldoFinalCaja });

      return snap;
    });
  }

  /**
   * Genera o actualiza el snapshot global del día sumando todos los snapshots de sucursal.
   * Además enlaza cada SucursalSaldoDiario.globalDiarioId al global creado/actualizado.
   */
  async generarSnapshotGlobalDia(dateISO: string, tz = '-06:00') {
    const { inicio } = dayBounds(dateISO, tz);

    return this.prisma.$transaction(async (tx) => {
      // 1) Obtener todos los snapshots de sucursales del día
      const snaps = await tx.sucursalSaldoDiario.findMany({
        where: { fecha: inicio },
        select: {
          id: true,
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

      // 2) Sumar
      const sum = snaps.reduce(
        (acc, s) => {
          acc.saldoTotalCaja += n(s.saldoFinalCaja); // puedes guardar finales o también inicios+movs
          acc.ingresosTotalCaja += n(s.ingresosCaja);
          acc.egresosTotalCaja += n(s.egresosCaja);

          acc.saldoTotalBanco += n(s.saldoFinalBanco);
          acc.ingresosTotalBanco += n(s.ingresosBanco);
          acc.egresosTotalBanco += n(s.egresosBanco);
          return acc;
        },
        {
          saldoTotalCaja: 0,
          ingresosTotalCaja: 0,
          egresosTotalCaja: 0,
          saldoTotalBanco: 0,
          ingresosTotalBanco: 0,
          egresosTotalBanco: 0,
        },
      );

      // 3) Upsert en SaldoGlobalDiario
      const global = await tx.saldoGlobalDiario.upsert({
        where: { fecha: inicio },
        update: {
          saldoTotalCaja: sum.saldoTotalCaja,
          ingresosTotalCaja: sum.ingresosTotalCaja,
          egresosTotalCaja: sum.egresosTotalCaja,
          saldoTotalBanco: sum.saldoTotalBanco,
          ingresosTotalBanco: sum.ingresosTotalBanco,
          egresosTotalBanco: sum.egresosTotalBanco,
        },
        create: {
          fecha: inicio,
          saldoTotalCaja: sum.saldoTotalCaja,
          ingresosTotalCaja: sum.ingresosTotalCaja,
          egresosTotalCaja: sum.egresosTotalCaja,
          saldoTotalBanco: sum.saldoTotalBanco,
          ingresosTotalBanco: sum.ingresosTotalBanco,
          egresosTotalBanco: sum.egresosTotalBanco,
        },
      });

      // 4) Enlazar cada snapshot al global (opcional pero recomendable)
      if (snaps.length) {
        await tx.sucursalSaldoDiario.updateMany({
          where: { fecha: inicio },
          data: { globalDiarioId: global.id },
        });
      }

      return global;
    });
  }

  async deleteAllSnapshoots() {
    const x = await this.prisma.sucursalSaldoDiario.deleteMany({});
    const y = await this.prisma.saldoGlobalDiario.deleteMany({});

    return {
      x,
      y,
    };
  }

  async getAllRegistros() {
    const [x, y] = await Promise.all([
      this.prisma.sucursalSaldoDiario.findMany({}),
      this.prisma.saldoGlobalDiario.findMany({}),
    ]);

    return { x, y };
  }
}
