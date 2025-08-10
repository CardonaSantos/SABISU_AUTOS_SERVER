import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EstadoTurnoCaja, Prisma, TipoMovimientoCaja } from '@prisma/client';
import { IniciarCaja } from './dto/open-regist.dto';
import { CerrarCaja } from './dto/cerrar-caja.dto';
import { CajaAbierta } from './dataTrsansfer/interfaces';
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
export class CajaService {
  private logger = new Logger(CajaService.name);
  constructor(private readonly prisma: PrismaService) {}

  /**
   *
   * @param dto datos primarios para abrir un registro de turno en caja
   * @returns un registro de caja semi-terminado
   */
  async iniciarCaja(dto: IniciarCaja) {
    try {
      const { comentario, saldoInicial, sucursalId, usuarioInicioId } = dto;
      this.logger.log('los datos son: ', dto);
      if ([saldoInicial, sucursalId, usuarioInicioId].some((p) => p == null)) {
        throw new BadRequestException('PROP INDEFINIDA');
      }

      return await this.prisma.$transaction(async (tx) => {
        const newCaja = await tx.registroCaja.create({
          data: {
            comentario: comentario,
            saldoInicial: saldoInicial,
            estado: 'ABIERTO',
            sucursal: {
              connect: {
                id: sucursalId,
              },
            },
            usuarioInicio: {
              connect: {
                id: usuarioInicioId,
              },
            },
          },
        });
        return newCaja;
      });
    } catch (error) {
      this.logger.error('El error es: ', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException({
        message: 'Fatal error: Error inesperado',
      });
    }
  }

  /**
   *
   * @param dto datos para cerrar la caja, monto final, ids de ventas y movimientos como egresos y depositos, que son movimientos de cajas
   * @returns
   */
  async cerrarCaja(dto: {
    cajaID: number;
    usuarioCierra: number;
    comentarioFinal?: string;
  }) {
    const { cajaID, usuarioCierra, comentarioFinal } = dto;

    return this.prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe(
        `SELECT id FROM "RegistroCaja" WHERE id = ${cajaID} FOR UPDATE`,
      );

      const caja = await tx.registroCaja.findUnique({
        where: { id: cajaID },
        select: { id: true, estado: true, saldoInicial: true },
      });
      if (!caja) throw new BadRequestException('Caja no existe');
      if (caja.estado !== 'ABIERTO')
        throw new BadRequestException('La caja no está abierta');

      const movimientos = await tx.movimientoCaja.findMany({
        where: { registroCajaId: cajaID },
        select: { tipo: true, monto: true },
      });

      let ingresos = 0,
        egresos = 0,
        ventas = 0,
        depositos = 0;
      for (const m of movimientos) {
        if (m.tipo === 'VENTA') {
          ventas += m.monto;
          ingresos += m.monto;
        } else if (['INGRESO', 'ABONO', 'TRANSFERENCIA'].includes(m.tipo))
          ingresos += m.monto;
        else if (
          ['EGRESO', 'DEPOSITO_BANCO', 'RETIRO', 'CHEQUE'].includes(m.tipo)
        ) {
          egresos += m.monto;
          if (m.tipo === 'DEPOSITO_BANCO') depositos += m.monto;
        }
      }
      const saldoFinal = caja.saldoInicial + ingresos - egresos;

      return tx.registroCaja.update({
        where: { id: cajaID },
        data: {
          estado: 'CERRADO',
          fechaCierre: new Date(),
          usuarioCierre: { connect: { id: usuarioCierra } },
          saldoFinal,
          comentarioFinal,
          // movimientoCaja: JSON.stringify({ ingresos, egresos, ventas, depositos }),
        },
      });
    });
  }
  /**
   *
   * @param sucursalId ID de la sucursal para conseguir el ultimo registro de sucursalSaldoDiario, retorna el monto final
   * @returns
   */
  async getSaldoInicial(sucursalId: number): Promise<number> {
    const turnoPrevio = await this.prisma.registroCaja.findFirst({
      where: {
        sucursalId,
        estado: 'CERRADO',
        depositado: false,
      },
      orderBy: { fechaCierre: 'desc' },
    });
    if (turnoPrevio?.saldoFinal != null) {
      return turnoPrevio.saldoFinal;
    }

    // Fallback: float oficial del día anterior
    const ayer = dayjs().subtract(1, 'day').startOf('day').toDate();
    const cierreDia = await this.prisma.sucursalSaldoDiario.findFirst({
      where: {
        sucursalId,
        fechaGenerado: ayer, // gracias al date-only, ya pega exacto
      },
    });
    return cierreDia?.saldoFinal ?? 0;
  }

  /**
   *
   * @param params ID de sucursal e usuarioID para encontrar la ultima caja abierta
   * @returns caja abierta con datos previos lista para cerrar
   */
  async conseguirCajaAbierta(params: {
    sucursalID: number;
    userID: number;
  }): Promise<CajaAbierta | null> {
    const { sucursalID, userID } = params;

    try {
      const caja = await this.prisma.registroCaja.findFirst({
        where: {
          sucursalId: sucursalID,
          usuarioInicioId: userID,
          estado: EstadoTurnoCaja.ABIERTO, // usa el enum en lugar de string literal
        },
        select: {
          id: true,
          saldoInicial: true,
          comentario: true,
          estado: true,
          fechaApertura: true,
          sucursal: {
            select: { id: true, nombre: true },
          },
          usuarioInicio: {
            select: { id: true, nombre: true },
          },
        },
      });

      this.logger.log('La caja abierta es: ', caja);

      if (!caja) return null;
      return {
        id: caja.id,
        saldoInicial: caja.saldoInicial,
        comentario: caja.comentario,
        fechaApertura: caja.fechaApertura,
        sucursalId: caja.sucursal.id,
        sucursalNombre: caja.sucursal.nombre,
        usuarioInicioId: caja.usuarioInicio.id,
        usuarioInicioNombre: caja.usuarioInicio.nombre,
        estado: caja.estado,
      };
    } catch (error) {
      this.logger.error('Error al obtener caja abierta:', error);
      throw new InternalServerErrorException(
        'Error inesperado al consultar turno de caja',
      );
    }
  }

  /**
   *
   * @returns Registros de cajas cerrados con toda la data necesaria para entender los movimientos
   */
  async getCajasRegistros() {
    try {
      const cajasRegistros = await this.prisma.registroCaja.findMany({
        where: {
          estado: 'CERRADO',
        },
        select: {
          id: true,
          comentario: true,
          estado: true,
          creadoEn: true,
          actualizadoEn: true,
          fechaApertura: true,
          fechaCierre: true,
          sucursal: true,
          movimientos: {
            include: {
              usuario: true,
            },
          },
          saldoFinal: true,
          saldoInicial: true,
          usuarioCierre: true,
          usuarioInicio: true,
          venta: {
            include: {
              cliente: true,
              productos: true,
              metodoPago: {
                select: {
                  metodoPago: true,
                },
              },
            },
          },
        },
      });

      const cajasFormatt = cajasRegistros.map((c) => ({
        cajaID: c.id,
        cajaComentario: c.comentario,
        fechaApertura: c.fechaApertura,
        fechaCierre: c.fechaCierre,
        creadoEn: c.creadoEn,
        actualizadoEn: c.actualizadoEn,
        saldoInicial: c.saldoInicial,
        saldoFinal: c.saldoFinal,
        estado: c.estado,
        usuario: {
          id: c.usuarioInicio.id,
          nombre: c.usuarioInicio.nombre,
          rol: c.usuarioInicio.rol,
          correo: c.usuarioInicio.correo,
        },
        sucursal: {
          id: c.sucursal.id,
          nombre: c.sucursal.nombre,
        },
        ventasEnTurno: c.venta.map((v) => ({
          id: v.id,
          fechaVenta: v.fechaVenta,
          referenciaPago: v.referenciaPago,
          tipoComprobante: v.tipoComprobante,
          totalVenta: v.totalVenta,
          productos: v.productos.map((prod) => ({
            id: prod.id,
            cantidadVentida: prod.cantidad,
            precioVendido: prod.precioVenta,
            estado: prod.estado,
          })),
        })),
        movimientosEnTurno: c.movimientos.map((m) => ({
          id: m.id,
          banco: m.banco,
          fechaMovimiento: m.fecha,
          tipoDeMovimiento: m.tipo,
          categoriaDeMovimiento: m.categoria,
          creadoEn: m.creadoEn,
          actualizadoEn: m.actualizadoEn,
          descripcionMovimiento: m.descripcion,
          monto: m.monto,
          numeroBoleta: m.numeroBoleta,
          referencia: m.referencia,
          usadoParaCierre: m.usadoParaCierre,
          usuarioRegistra: {
            id: m.usuario.id,
            nombre: m.usuario.nombre,
            rol: m.usuario.rol,
          },
        })),
      }));
      return cajasFormatt;
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      this.logger.error('Error cerrando caja:', err);
      throw new InternalServerErrorException('Error inesperado al cerrar caja');
    }
  }
}
