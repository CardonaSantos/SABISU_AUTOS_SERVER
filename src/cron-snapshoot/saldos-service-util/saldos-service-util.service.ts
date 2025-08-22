import { Injectable } from '@nestjs/common';
import { dayBounds, n } from '../helpers';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SaldosServiceUtilService {
  constructor(private readonly prisma: PrismaService) {}
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
}
