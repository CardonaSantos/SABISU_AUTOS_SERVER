import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSucursalSaldoDto } from './dto/create-sucursal-saldo.dto';
import { UpdateSucursalSaldoDto } from './dto/update-sucursal-saldo.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SucursalSaldoService {
  constructor(private readonly prisma: PrismaService) {}

  create(createSucursalSaldoDto: CreateSucursalSaldoDto) {
    return 'This action adds a new sucursalSaldo';
  }

  async findAll() {
    try {
      return await this.prisma.saldoGlobalDiario.findMany({
        include: {
          saldosDiarios: {
            include: {
              sucursal: { select: { id: true, nombre: true } },
            },
          },
        },
        orderBy: { fecha: 'desc' },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error al obtener los saldos globales',
      );
    }
  }

  async findOne(sucursalId: number) {
    // try {
    //   const today = new Date();
    //   const startOfDay = new Date(
    //     today.getFullYear(),
    //     today.getMonth(),
    //     today.getDate(),
    //   );
    //   const endOfDay = new Date(startOfDay);
    //   endOfDay.setDate(endOfDay.getDate() + 1);
    //   let saldo = await this.prisma.sucursalSaldoDiario.findFirst({
    //     where: {
    //       sucursalId,
    //       fechaGenerado: { gte: startOfDay, lt: endOfDay },
    //     },
    //     include: {
    //       sucursal: { select: { id: true, nombre: true } },
    //       globalDiario: true,
    //     },
    //   });
    //   if (!saldo) {
    //     let global = await this.prisma.saldoGlobalDiario.findFirst({
    //       where: { fecha: { gte: startOfDay, lt: endOfDay } },
    //     });
    //     if (!global) {
    //       global = await this.prisma.saldoGlobalDiario.create({
    //         data: {
    //           fecha: startOfDay,
    //           saldoTotal: 0,
    //           ingresosTotal: 0,
    //           egresosTotal: 0,
    //         },
    //       });
    //     }
    //     saldo = await this.prisma.sucursalSaldoDiario.create({
    //       data: {
    //         sucursalId,
    //         fecha: startOfDay,
    //         saldoInicio: 0,
    //         saldoFinal: 0,
    //         totalIngresos: 0,
    //         totalEgresos: 0,
    //         globalDiarioId: global.id,
    //         fechaGenerado: startOfDay,
    //       },
    //       include: {
    //         sucursal: { select: { id: true, nombre: true } },
    //         globalDiario: true,
    //       },
    //     });
    //   }
    //   return saldo;
    // } catch (error) {
    //   console.error(error);
    //   throw new InternalServerErrorException(
    //     'Error al obtener el saldo diario de la sucursal',
    //   );
    // }
  }

  async getAllDepositosSucursal(sucursalId: number) {
    // try {
    //   return await this.prisma.sucursalSaldoDiario.findMany({
    //     where: { sucursalId, totalIngresos: { gt: 0 } },
    //     orderBy: { fecha: 'desc' },
    //   });
    // } catch (error) {
    //   console.error(error);
    //   throw new InternalServerErrorException(
    //     'Error al obtener los depósitos de la sucursal',
    //   );
    // }
  }

  async getAllEgresosSucursal(sucursalId: number) {
    // try {
    //   return await this.prisma.sucursalSaldoDiario.findMany({
    //     where: { sucursalId, totalEgresos: { gt: 0 } },
    //     orderBy: { fecha: 'desc' },
    //   });
    // } catch (error) {
    //   console.error(error);
    //   throw new InternalServerErrorException(
    //     'Error al obtener los egresos de la sucursal',
    //   );
    // }
  }

  update(id: number, updateSucursalSaldoDto: UpdateSucursalSaldoDto) {
    return `This action updates a #${id} sucursalSaldo`;
  }

  remove(id: number) {
    return `This action removes a #${id} sucursalSaldo`;
  }

  /**
   * Obtiene el snapshot diario de saldo de una sucursal. Si no existe,
   * intenta recalcular mínimos usando cierres de caja del día.
   */
  async getSaldoDiario(sucursalId: number, fechaISO?: string) {
    // try {
    //   const fecha = fechaISO ? new Date(fechaISO) : new Date();
    //   // normalizamos a inicio y fin del día
    //   const startOfDay = new Date(
    //     fecha.getFullYear(),
    //     fecha.getMonth(),
    //     fecha.getDate(),
    //   );
    //   const endOfDay = new Date(
    //     fecha.getFullYear(),
    //     fecha.getMonth(),
    //     fecha.getDate() + 1,
    //   );
    //   // 1) Buscar snapshot guardado del día
    //   const snap = await this.prisma.sucursalSaldoDiario.findFirst({
    //     where: { sucursalId, fechaGenerado: startOfDay },
    //     select: {
    //       saldoInicio: true,
    //       saldoFinal: true,
    //       totalIngresos: true,
    //       totalEgresos: true,
    //     },
    //   });
    //   if (snap) {
    //     // normalizamos por si vienen nulls desde DB
    //     return {
    //       saldoInicio: Number(snap.saldoInicio ?? 0),
    //       saldoFinal: Number(snap.saldoFinal ?? 0),
    //       totalIngresos:
    //         snap.totalIngresos === null ? null : Number(snap.totalIngresos),
    //       totalEgresos:
    //         snap.totalEgresos === null ? null : Number(snap.totalEgresos),
    //     };
    //   }
    //   // 2) Recalcular básico desde cierres de caja del día
    //   const cierres = await this.prisma.registroCaja.findMany({
    //     where: {
    //       sucursalId,
    //       fechaCierre: { gte: startOfDay, lt: endOfDay },
    //     },
    //     select: { saldoInicial: true, saldoFinal: true, id: true },
    //     orderBy: { fechaCierre: 'asc' },
    //   });
    //   const saldoInicio = cierres.length
    //     ? Number(cierres[0].saldoInicial ?? 0)
    //     : 0;
    //   const saldoFinal = cierres.length
    //     ? Number(cierres[cierres.length - 1].saldoFinal ?? 0)
    //     : 0;
    //   // Si más adelante quieres sumar ingresos/egresos del día, acá es el lugar:
    //   // const totalIngresos = await this.prisma.movimientoCaja.aggregate({...})
    //   // const totalEgresos = await this.prisma.movimientoCaja.aggregate({...})
    //   const totalIngresos: number | null = null;
    //   const totalEgresos: number | null = null;
    //   return { saldoInicio, saldoFinal, totalIngresos, totalEgresos };
    // } catch (error) {
    //   console.error('[SucursalSaldoQueryService.getSaldoDiario]', error);
    //   throw new InternalServerErrorException(
    //     'Error al obtener el saldo diario',
    //   );
    // }
  }
}
