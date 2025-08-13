import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  EstadoTurnoCaja,
  MetodoPago,
  Prisma,
  RegistroCaja,
  TipoMovimientoCaja,
} from '@prisma/client';
import { IniciarCaja } from './dto/open-regist.dto';
import { CerrarCaja } from './dto/cerrar-caja.dto';
import { CajaAbierta } from './dataTrsansfer/interfaces';
import * as dayjs from 'dayjs';
import 'dayjs/locale/es';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { VentaLigadaACajaDTO } from './dto/new-dto';
import { TZGT } from 'src/utils/utils';
import { UtilidadesService } from './utilidades/utilidades.service';
import { DepositoCierreDto } from 'src/movimiento-caja/dto/deposito-cierre-caja';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale('es');

@Injectable()
export class CajaService {
  private logger = new Logger(CajaService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly utilidades: UtilidadesService,
  ) {
    console.log('CajaService prisma inyectado?', !!this.prisma);
  }

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
   * Para cerrar una caja manualmente sin depositar, solo cerrar turno en caja
   * @param dto datos para cerrar la caja, monto final, ids de ventas y movimientos como egresos y depositos, que son movimientos de cajas
   * @returns
   */
  async cerrarCaja(
    dto: {
      cajaID: number;
      usuarioCierra: number;
      comentarioFinal?: string;
    },
    cierreCaja: boolean = false,
    valorAjustado: number = 0,
  ) {
    const { cajaID, usuarioCierra, comentarioFinal } = dto;

    return this.prisma.$transaction(async (tx) => {
      await tx.$queryRawUnsafe(
        `SELECT id FROM "RegistroCaja" WHERE id = ${cajaID} FOR UPDATE`,
      );

      const caja = await tx.registroCaja.findUnique({
        where: { id: cajaID },
        select: {
          id: true,
          estado: true,
          saldoInicial: true,
          sucursalId: true,
        },
      });
      if (!caja) throw new BadRequestException('Caja no existe');
      if (caja.estado !== 'ABIERTO')
        throw new BadRequestException('La caja no está abierta');

      const tot = await this.utilidades.calcularTotalesTurno(tx, cajaID);
      const saldoFinal = caja.saldoInicial + tot.neto;

      const cerrada = await tx.registroCaja.update({
        where: { id: cajaID },
        data: {
          estado: 'CERRADO',
          fechaCierre: dayjs().tz(TZGT).toDate(),
          usuarioCierre: { connect: { id: usuarioCierra } },
          saldoFinal,
          comentarioFinal: comentarioFinal ?? null,
          depositado: false, // no hubo depósito de cierre
        },
      });

      await this.utilidades.upsertSaldoDiarioTx(
        tx,
        caja.sucursalId,
        cerrada,
        tot,
      );

      if (cierreCaja) {
        this.logger.debug(
          'Aqui poner los flags de que la caja ha cerrado, y opcionalmente si nos pasaron una cantidad custom, poner el estado idoneo',
        );

        if (valorAjustado > 0) {
          this.logger.log(
            'Ajustar el saldo final de la caja, porque nos mandaron otro, o acortaron el monto',
          );
        }
      }

      return cerrada;
    });
  }

  /**
   *
   * @param sucursalId ID de la sucursal para conseguir el ultimo registro de sucursalSaldoDiario, retorna el monto final
   * @returns
   */
  async getSaldoInicial(sucursalId: number): Promise<number> {
    // (opcional) si ya hay caja abierta, no abras otra
    const abierta = await this.prisma.registroCaja.findFirst({
      where: { sucursalId, estado: 'ABIERTO', fechaCierre: null },
      select: { saldoInicial: true, id: true },
    });
    if (abierta) return abierta.saldoInicial; // o lanza error, según tu regla

    // Última caja cerrada de la sucursal (sin filtrar por depositado)
    const ultima = await this.prisma.registroCaja.findFirst({
      where: { sucursalId, estado: 'CERRADO' },
      orderBy: { fechaCierre: 'desc' },
      select: { saldoFinal: true, depositado: true },
    });

    if (!ultima) {
      // Fallback (opcional): toma el último snapshot diario si existe
      const cierreDia = await this.prisma.sucursalSaldoDiario.findFirst({
        where: { sucursalId },
        orderBy: { fechaGenerado: 'desc' },
        select: { saldoFinal: true },
      });
      return cierreDia?.saldoFinal ?? 0;
    }

    // Regla central:
    return ultima.depositado ? 0 : (ultima.saldoFinal ?? 0);
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

  /**
   * Liga una venta al turno de caja abierto de su sucursal.
   * - Requiere caja abierta si la venta tiene pagos en EFECTIVO (configurable).
   * - Idempotente: si ya está ligada, no falla.
   */

  // Wrapper opcional: si alguien llama sin tx, abrimos una.
  async linkVentaToCaja(
    ventaID: number,
    sucursalID?: number,
    opts?: { exigirCajaSiEfectivo?: boolean },
  ) {
    return this.prisma.$transaction((tx) =>
      this.linkVentaToCajaTx(tx, ventaID, sucursalID, opts),
    );
  }

  async linkVentaToCajaTx(
    tx: Prisma.TransactionClient,
    ventaID: number,
    sucursalID?: number,
    opts?: { exigirCajaSiEfectivo?: boolean },
  ) {
    console.log('El id venta es: ', ventaID);

    const { exigirCajaSiEfectivo = true } = opts ?? {};
    await tx.$executeRaw`SET LOCAL lock_timeout = '3s'`;

    const venta = await tx.venta.findUnique({
      where: { id: ventaID },
      select: {
        id: true,
        totalVenta: true,
        registroCajaId: true,
        sucursalId: true,
        metodoPago: { select: { metodoPago: true } },
      },
    });
    if (!venta) throw new NotFoundException({ message: 'Venta no encontrada' });
    if (venta.registroCajaId) return venta;

    const sucursal = sucursalID ?? venta.sucursalId;
    if (!sucursal)
      throw new BadRequestException({ message: 'Venta sin sucursal asociada' });

    const requiereCaja =
      venta.metodoPago?.metodoPago === MetodoPago.CONTADO &&
      venta.totalVenta > 0;

    console.log('requiere caja? ', requiereCaja);

    const cajaAbierta = await tx.registroCaja.findFirst({
      where: { sucursalId: sucursal, estado: 'ABIERTO', fechaCierre: null },
      orderBy: { fechaApertura: 'desc' },
      select: { id: true },
    });

    console.log('La caja abierta es: ', cajaAbierta);

    if (!cajaAbierta) {
      if (requiereCaja && exigirCajaSiEfectivo) {
        throw new BadRequestException({
          message: 'No hay caja abierta para venta en efectivo.',
        });
      }
      return venta; // tarjeta/transferencia/crédito sin caja
    }

    // lock + re-chequeo
    const locked = await tx.$queryRaw<
      Array<{ estado: string; fechaCierre: Date | null }>
    >`
      SELECT estado, "fechaCierre" FROM "RegistroCaja"
      WHERE id = ${cajaAbierta.id}
      FOR UPDATE NOWAIT
    `;
    const stillOpen =
      locked.length === 1 &&
      locked[0].estado === 'ABIERTO' &&
      locked[0].fechaCierre === null;
    if (!stillOpen) {
      if (requiereCaja && exigirCajaSiEfectivo) {
        throw new BadRequestException({
          message: 'La caja se cerró durante el proceso.',
        });
      }
      return venta;
    }

    const ventaUdated = await tx.venta.updateMany({
      where: { id: ventaID, registroCajaId: null },
      data: { registroCajaId: cajaAbierta.id },
    });
    this.logger.log('La venta actualizada es: ', ventaUdated);

    return tx.venta.findUnique({
      where: { id: ventaID },
      select: { id: true, registroCajaId: true, sucursalId: true },
    });
  }

  /**
   *
   * @param cajaID ID DE LA CAJA
   * @returns ventas de la caja
   */
  // DTOs para la UI
  async getVentasLigadasACaja(
    cajaID: number,
    opts?: { page?: number; pageSize?: number; order?: 'asc' | 'desc' },
  ): Promise<VentaLigadaACajaDTO[]> {
    try {
      if (!Number.isInteger(cajaID) || cajaID <= 0) {
        throw new BadRequestException('ID no proporcionado o inválido');
      }

      const page = opts?.page ?? 1;
      const pageSize = opts?.pageSize ?? 50;
      const order = opts?.order ?? 'desc';

      const ventas = await this.prisma.venta.findMany({
        where: {
          registroCajaId: cajaID,
          metodoPago: {
            metodoPago: 'CONTADO',
          },
        },
        orderBy: { horaVenta: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          horaVenta: true,
          totalVenta: true,
          tipoComprobante: true,
          referenciaPago: true,
          metodoPago: { select: { metodoPago: true } }, // puede ser null si la FK es opcional
          productos: {
            select: {
              id: true,
              cantidad: true,
              estado: true,
              precioVenta: true,
              producto: {
                select: { id: true, nombre: true, codigoProducto: true },
              },
            },
          },
          cliente: { select: { id: true, nombre: true } }, // null si no tiene cliente
        },
      });

      const formattedData: VentaLigadaACajaDTO[] = ventas.map((v) => ({
        id: v.id,
        cliente: v.cliente
          ? { id: v.cliente.id, nombre: v.cliente.nombre }
          : null,
        totalVenta: v.totalVenta,
        tipoComprobante: v.tipoComprobante,
        referenciaPago: v.referenciaPago,
        metodoPago: v.metodoPago ?? null,
        horaVenta: v.horaVenta,
        productos: v.productos.map((p) => ({
          lineaId: p.id,
          precioVenta: p.precioVenta,
          estado: p.estado,
          cantidad: p.cantidad,
          productoId: p.producto.id,
          nombre: p.producto.nombre,
          codigoProducto: p.producto.codigoProducto,
        })),
      }));

      return formattedData;
    } catch (error) {
      this.logger.error('getVentasLigadasACaja error:', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException({ message: 'Error inesperado' });
    }
  }

  /**
   *
   * @param
   * @returns data real sobre los totales del turno de la caja
   */
  async previewCierre({
    sucursalId,
    usuarioId,
  }: {
    sucursalId: number;
    usuarioId: number;
  }) {
    const caja = await this.prisma.registroCaja.findFirst({
      where: {
        sucursalId,
        usuarioInicioId: usuarioId,
        estado: 'ABIERTO',
        fechaCierre: null,
      },
      orderBy: { fechaApertura: 'desc' },
      select: { id: true, saldoInicial: true },
    });
    if (!caja) throw new BadRequestException('No hay caja abierta');

    const tot = await this.utilidades.calcularTotalesTurno(
      this.prisma,
      caja.id,
    );
    const efectivoDisponible = caja.saldoInicial + tot.ingresos - tot.egresos;

    return {
      cajaId: caja.id,
      saldoInicial: caja.saldoInicial,
      ...tot, // ingresos, egresos, depositos, ventasEfectivo, neto
      efectivoDisponible,
      timestamp: new Date().toISOString(),
    };
  }

  async deleteAllCajas() {
    return this.prisma.registroCaja.deleteMany({});
  }
}
