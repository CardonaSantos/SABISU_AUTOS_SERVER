import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TotalesTurno } from '../types';

@Injectable()
export class UtilidadesService {
  private logger = new Logger(UtilidadesService.name);

  /**
   * 
   * @param tx recibe la transaccion main del flujo
   * @param cajaId id de la caja a la que va a calcular su total de saldo final en turno
   * @returns       
   * ventasEfectivo,
      ingresos,
      egresos,
      depositos,
      neto: ingresos - egresos,
   */
  async calcularTotalesTurno(tx: Prisma.TransactionClient, cajaId: number) {
    // ventas en efectivo ligadas al turno
    // const ventas = await tx.venta.aggregate({
    //   where: {
    //     registroCajaId: cajaId,
    //     metodoPago: { metodoPago: { in: ['CONTADO'] } }, // adapta si tienes mixtos
    //   },
    //   _sum: { totalVenta: true },
    // });
    // const ventasEfectivo = ventas._sum.totalVenta ?? 0;
    // const movimientos = await tx.movimientoCaja.findMany({
    //   where: { registroCajaId: cajaId },
    //   select: { tipo: true, monto: true },
    // });
    // let ingresos = ventasEfectivo;
    // let egresos = 0;
    // let depositos = 0;
    // for (const m of movimientos) {
    //   if (
    //     m.tipo === 'INGRESO' ||
    //     m.tipo === 'ABONO' ||
    //     m.tipo === 'TRANSFERENCIA'
    //   )
    //     ingresos += m.monto;
    //   if (
    //     m.tipo === 'EGRESO' ||
    //     m.tipo === 'RETIRO' ||
    //     m.tipo === 'CHEQUE' ||
    //     m.tipo === 'DEPOSITO_BANCO'
    //   ) {
    //     egresos += m.monto;
    //     if (m.tipo === 'DEPOSITO_BANCO') depositos += m.monto;
    //   }
    // }
    // return {
    //   ventasEfectivo,
    //   ingresos,
    //   egresos,
    //   depositos,
    //   neto: ingresos - egresos,
    // };
  }

  /**
   *
   * @param tx recibe la transaccion
   * @param sucursalId id de la sucursal a añadirle los registros de saldo
   * @param cajaCerrada Objeto que lleva info del cierre
   * @param tot totales del turno
   */
  async upsertSaldoDiarioTx(
    tx: Prisma.TransactionClient,
    sucursalId: number,
    cajaCerrada: {
      fechaCierre: Date | null;
      saldoInicial: number;
      saldoFinal: number;
    },
    tot: TotalesTurno,
  ) {
    // // Fecha a medianoche
    // const d = new Date(cajaCerrada.fechaCierre ?? new Date());
    // const fecha = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    // // Busca si ya existe el snapshot del día
    // const existente = await tx.sucursalSaldoDiario.findFirst({
    //   where: { sucursalId, fechaGenerado: fecha },
    //   select: {
    //     id: true,
    //     saldoInicio: true,
    //     totalIngresos: true,
    //     totalEgresos: true,
    //   },
    // });
    // this.logger.log(
    //   'El registro de sucursal saldo diario que es un snapshoot del dia es: ',
    //   existente,
    // );
    // if (!existente) {
    //   await tx.sucursalSaldoDiario.create({
    //     data: {
    //       sucursalId,
    //       fecha,
    //       fechaGenerado: fecha,
    //       saldoInicio: cajaCerrada.saldoInicial, // primer turno del día
    //       saldoFinal: cajaCerrada.saldoFinal, // se irá actualizando con cada cierre
    //       totalIngresos: tot.ingresos,
    //       totalEgresos: tot.egresos,
    //     },
    //   });
    // } else {
    //   await tx.sucursalSaldoDiario.update({
    //     where: { id: existente.id },
    //     data: {
    //       // saldoInicio se conserva (del primer turno)
    //       saldoFinal: cajaCerrada.saldoFinal, // último cierre sobrescribe
    //       totalIngresos: existente.totalIngresos + tot.ingresos,
    //       totalEgresos: existente.totalEgresos + tot.egresos,
    //     },
    //   });
    // }
  }

  // =======================> HELPERS EXTRA PARA
}
