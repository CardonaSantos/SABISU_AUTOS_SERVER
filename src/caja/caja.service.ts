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
  ClasificacionAdmin,
  EstadoTurnoCaja,
  MetodoPago,
  MotivoMovimiento,
  Prisma,
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
import { IniciarCajaDto } from './dto/iniciar-caja.dto';
import { CerrarCajaDto } from './dto/CerrarCajaDto';
import { CerrarCajaV2Dto } from './cerrarCajaTypes';
import { GetCajasQueryDto } from './GetCajasQueryDto ';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale('es');
type Paginated<T> = {
  total: number;
  page: number;
  limit: number;
  pages: number;
  items: T[];
};
@Injectable()
export class CajaService {
  private logger = new Logger(CajaService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly utilidades: UtilidadesService,
  ) {}
  private toNum(n: any): number {
    return n == null ? 0 : Number(n);
  }
  private isZero(n: any): boolean {
    return Math.abs(this.toNum(n)) < 0.000001;
  }

  // ---------- INFERENCIAS DESDE DELTAS ----------
  private inferTipo(m: any): string {
    const dc = this.toNum(m.deltaCaja);
    const db = this.toNum(m.deltaBanco);

    if (!this.isZero(dc) && this.isZero(db)) {
      if (dc > 0) return m.motivo === 'VENTA' ? 'VENTA' : 'INGRESO';
      if (dc < 0) return m.motivo === 'DEVOLUCION' ? 'DEVOLUCION' : 'EGRESO';
    }
    if (this.isZero(dc) && !this.isZero(db)) {
      return db > 0 ? 'DEPOSITO_BANCO' : 'RETIRO';
    }
    if (dc < 0 && db > 0) return 'TRANSFERENCIA';
    return 'OTRO';
  }

  private inferCategoria(m: any): string | null {
    if (m.esDepositoCierre || m.motivo === 'DEPOSITO_CIERRE')
      return 'DEPOSITO_CIERRE';
    if (m.esDepositoProveedor || m.motivo === 'DEPOSITO_PROVEEDOR')
      return 'DEPOSITO_PROVEEDOR';
    if (m.clasificacion === 'GASTO_OPERATIVO') return 'GASTO_OPERATIVO';
    if (m.clasificacion === 'COSTO_VENTA') return 'COSTO_VENTA';
    return null;
  }

  private montoDesdeDeltas(m: any): number {
    const dc = this.toNum(m.deltaCaja);
    const db = this.toNum(m.deltaBanco);
    if (!this.isZero(dc)) return Math.abs(dc);
    return Math.abs(db);
  }

  private maybeBoleta(ref: string | null | undefined): string | null {
    if (!ref) return null;
    return /^[0-9]{4,}$/.test(ref) ? ref : null;
  }

  private buildMovWhere(
    dto: GetCajasQueryDto,
  ): Prisma.MovimientoFinancieroWhereInput {
    const ors: Prisma.MovimientoFinancieroWhereInput[] = [];

    // tipo[]
    if (dto.tipo?.length) {
      for (const t of dto.tipo) {
        switch (t) {
          case 'VENTA':
            ors.push({ motivo: MotivoMovimiento.VENTA });
            break;
          case 'INGRESO':
            ors.push({ deltaCaja: { gt: 0 } });
            break;
          case 'EGRESO':
            ors.push({ deltaCaja: { lt: 0 } });
            break;
          case 'DEPOSITO_BANCO':
            ors.push({
              OR: [{ deltaBanco: { gt: 0 } }, { esDepositoCierre: true }],
            });
            break;
          case 'RETIRO':
            ors.push({ deltaBanco: { lt: 0 } });
            break;
          case 'TRANSFERENCIA':
            ors.push({
              AND: [{ deltaCaja: { lt: 0 } }, { deltaBanco: { gt: 0 } }],
            });
            break;
          case 'DEVOLUCION':
            ors.push({ motivo: MotivoMovimiento.DEVOLUCION });
            break;
          default:
            // otros tipos legacy -> no filtrar
            break;
        }
      }
    }

    // categoria[]
    if (dto.categoria?.length) {
      const orCat: Prisma.MovimientoFinancieroWhereInput[] = [];
      for (const c of dto.categoria) {
        switch (c) {
          case 'DEPOSITO_CIERRE':
            orCat.push({ esDepositoCierre: true });
            break;
          case 'DEPOSITO_PROVEEDOR':
            orCat.push({ esDepositoProveedor: true });
            break;
          case 'GASTO_OPERATIVO':
            orCat.push({ clasificacion: ClasificacionAdmin.GASTO_OPERATIVO });
            break;
          case 'COSTO_VENTA':
            orCat.push({ clasificacion: ClasificacionAdmin.COSTO_VENTA });
            break;
          default:
            break;
        }
      }
      if (orCat.length) ors.push({ OR: orCat });
    }

    const where: Prisma.MovimientoFinancieroWhereInput = {};
    if (ors.length) where.AND = [{ OR: ors }];

    // fechas de movimiento
    if (dto.fechaMovInicio || dto.fechaMovFin) {
      if (!Array.isArray(where.AND)) where.AND = [];
      where.AND.push({
        fecha: {
          gte: dto.fechaMovInicio ? new Date(dto.fechaMovInicio) : undefined,
          lte: dto.fechaMovFin ? new Date(dto.fechaMovFin) : undefined,
        },
      });
    }

    // search
    if (dto.search?.trim()) {
      const q = dto.search.trim();
      if (!Array.isArray(where.AND)) where.AND = [];
      where.AND.push({
        OR: [
          { descripcion: { contains: q, mode: 'insensitive' } },
          { referencia: { contains: q, mode: 'insensitive' } },
          { cuentaBancaria: { banco: { contains: q, mode: 'insensitive' } } },
          { proveedor: { nombre: { contains: q, mode: 'insensitive' } } },
          { usuario: { nombre: { contains: q, mode: 'insensitive' } } },
        ],
      });
    }

    return where;
  }

  //HELPERS

  /**
   *
   * @param dto datos primarios para abrir un registro de turno en caja
   * @returns un registro de caja semi-terminado
   */
  async iniciarCaja(dto: IniciarCajaDto) {
    const { sucursalId, usuarioInicioId, comentario } = dto;
    if ([sucursalId, usuarioInicioId].some((p) => p == null)) {
      throw new BadRequestException(
        'sucursalId y usuarioInicioId son obligatorios',
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // 1) No permitir dos turnos abiertos en la sucursal
      const abierta = await tx.registroCaja.findFirst({
        where: {
          sucursalId,
          estado: EstadoTurnoCaja.ABIERTO,
          fechaCierre: null,
        },
        select: { id: true },
      });
      if (abierta) {
        throw new BadRequestException(
          'Ya existe una caja abierta en esta sucursal',
        );
      }

      // 2) Calcular saldo inicial si no viene
      const saldoInicial =
        dto.saldoInicial != null
          ? dto.saldoInicial
          : await this.getSaldoInicial(tx, sucursalId);

      // 3) Crear el turno
      const newTurno = await tx.registroCaja.create({
        data: {
          sucursal: { connect: { id: sucursalId } },
          usuarioInicio: { connect: { id: usuarioInicioId } },
          comentario: comentario ?? null,
          saldoInicial, // Decimal soporta number de entrada
          estado: EstadoTurnoCaja.ABIERTO,
          fondoFijo: dto.fondoFijo ?? 0,
        },
      });

      return newTurno;
    });
  }

  /**
   * Para cerrar una caja manualmente sin depositar, solo cerrar turno en caja
   * @param dto datos para cerrar la caja, monto final, ids de ventas y movimientos como egresos y depositos, que son movimientos de cajas
   * @returns
   */
  async cerrarCaja(dto: CerrarCajaDto) {
    const { registroCajaId, comentarioFinal } = dto;
    this.logger.debug('Los datos son: ', registroCajaId, comentarioFinal);
    return this.prisma.$transaction(async (tx) => {
      const turno = await tx.registroCaja.findUnique({
        where: { id: registroCajaId },
        select: {
          id: true,
          estado: true,
          saldoInicial: true,
          fondoFijo: true,
          sucursalId: true,
        },
      });
      if (!turno || turno.estado !== 'ABIERTO') {
        throw new BadRequestException('Turno no encontrado o ya cerrado');
      }

      const sumas = await this.momentoMovimientoFinancieroSum(turno.id); // ← ver helper abajo
      const saldoFinal = Number(turno.saldoInicial) + Number(sumas.deltaCaja);

      // Cerrar
      const cerrado = await tx.registroCaja.update({
        where: { id: turno.id },
        data: {
          estado: 'CERRADO',
          fechaCierre: new Date(),
          saldoFinal,
          comentarioFinal: comentarioFinal ?? null,
        },
      });

      return { ...cerrado, sumas };
    });
  }

  async cerrarCajaV2(dto: CerrarCajaV2Dto) {
    const {
      registroCajaId,
      usuarioCierreId,
      comentarioFinal,
      modo,
      cuentaBancariaId,
      montoParcial,
      abrirSiguiente,
      usuarioInicioSiguienteId,
      fondoFijoSiguiente,
      comentarioAperturaSiguiente,
    } = dto;

    return this.prisma.$transaction(async (tx) => {
      const turno = await tx.registroCaja.findUnique({
        where: { id: registroCajaId },
        select: {
          id: true,
          estado: true,
          saldoInicial: true,
          fondoFijo: true,
          sucursalId: true,
        },
      });
      if (!turno || turno.estado !== 'ABIERTO') {
        throw new BadRequestException('Turno no encontrado o ya cerrado');
      }

      // Σ deltaCaja del turno
      const agg = await tx.movimientoFinanciero.aggregate({
        _sum: { deltaCaja: true },
        where: { registroCajaId: turno.id },
      });
      const enCaja =
        Number(turno.saldoInicial) + Number(agg._sum.deltaCaja ?? 0);

      // --- Deposito según modo (simple) ---
      let deposito = 0;
      if (modo === 'DEPOSITO_TODO') {
        deposito = enCaja;
      } else if (modo === 'DEPOSITO_PARCIAL') {
        if (!montoParcial || montoParcial <= 0)
          throw new BadRequestException('Monto parcial inválido');
        deposito = Math.min(montoParcial, enCaja);
      } else if (modo === 'SIN_DEPOSITO' || modo === 'CAMBIO_TURNO') {
        deposito = 0; // no hay depósito en estos modos
      } else {
        throw new BadRequestException('Modo de cierre no soportado');
      }

      // Validación de cuenta sólo si hay depósito
      let movDeposito: any = null;
      if (deposito > 0) {
        if (!cuentaBancariaId)
          throw new BadRequestException(
            'Cuenta bancaria requerida para depósito',
          );
        movDeposito = await tx.movimientoFinanciero.create({
          data: {
            sucursalId: turno.sucursalId,
            registroCajaId: turno.id,
            clasificacion: 'TRANSFERENCIA',
            motivo: 'DEPOSITO_CIERRE',
            metodoPago: 'TRANSFERENCIA',
            deltaCaja: -deposito,
            deltaBanco: +deposito,
            cuentaBancariaId,
            esDepositoCierre: true,
            descripcion: 'Depósito de cierre',
            usuarioId: usuarioCierreId,
          },
        });
      }

      // Recalcular saldo final y cerrar
      const agg2 = await tx.movimientoFinanciero.aggregate({
        _sum: { deltaCaja: true },
        where: { registroCajaId: turno.id },
      });
      const saldoFinal =
        Number(turno.saldoInicial) + Number(agg2._sum.deltaCaja ?? 0);

      const cerrado = await tx.registroCaja.update({
        where: { id: turno.id },
        data: {
          estado: 'CERRADO',
          fechaCierre: new Date(),
          saldoFinal,
          comentarioFinal: comentarioFinal ?? null,
          depositado: deposito > 0,
        },
      });

      // Cambio de turno (sin depósito)
      let nuevoTurno: any = null;
      const abrir = modo === 'CAMBIO_TURNO' ? (abrirSiguiente ?? true) : false;
      if (abrir) {
        const nextUser = usuarioInicioSiguienteId ?? usuarioCierreId;
        const nextFondo = fondoFijoSiguiente ?? Number(turno.fondoFijo ?? 0);
        nuevoTurno = await tx.registroCaja.create({
          data: {
            sucursalId: turno.sucursalId,
            usuarioInicioId: nextUser,
            saldoInicial: saldoFinal, // arrastra el saldo que quedó
            fondoFijo: nextFondo,
            comentario:
              comentarioAperturaSiguiente ?? 'Apertura por cambio de turno',
            estado: 'ABIERTO',
          },
        });
      }

      return {
        turnoCerrado: {
          id: cerrado.id,
          saldoFinal,
          depositoRealizado: deposito,
        },
        movimientoDeposito: movDeposito,
        nuevoTurno,
        enCajaAntes: enCaja,
      };
    });
  }

  // Helper (puedes mover a repository)
  // Si no quieres un raw, usa aggregate de Prisma directamente
  private async momentoMovimientoFinancieroSum(registroCajaId: number) {
    const agg = await this.prisma.movimientoFinanciero.aggregate({
      _sum: { deltaCaja: true },
      where: { registroCajaId },
    });
    return { deltaCaja: agg._sum.deltaCaja ?? 0 };
  }

  /**
   * Saldo inicial sugerido:
   * - Si hay turno cerrado más reciente: usar su saldoFinal.
   * - Sino, usar snapshot diario (nuevo: saldoFinalCaja). Si aún no migras, usa tu campo anterior.
   * - Sino, 0.
   */
  private async getSaldoInicial(
    tx: PrismaService['$transaction']['arguments'][0],
    sucursalId: number,
  ): Promise<number> {
    // Último turno cerrado/arqueeado
    const ultima = await tx.registroCaja.findFirst({
      where: {
        sucursalId,
        estado: { in: [EstadoTurnoCaja.CERRADO, EstadoTurnoCaja.ARQUEO] },
      },
      orderBy: { fechaCierre: 'desc' },
      select: { saldoFinal: true },
    });
    if (ultima?.saldoFinal != null) {
      const sf = Number(ultima.saldoFinal);
      return Math.abs(sf) < 0.01 ? 0 : sf;
    }

    // Snapshot diario (si ya migraste a los nuevos campos)
    // ⚠️ Si aún no migraste, usa select: { saldoFinal: true }
    const snap = await tx.sucursalSaldoDiario.findFirst({
      where: { sucursalId },
      orderBy: { fecha: 'desc' },
      select: { saldoFinalCaja: true }, // <- nuevo esquema
      // select: { saldoFinal: true },   // <- antiguo
    });

    const fallback =
      (snap as any)?.saldoFinalCaja ?? (snap as any)?.saldoFinal ?? 0;
    return Number(fallback) || 0;
  }

  /**
   *
   * @param params ID de sucursal e usuarioID para encontrar la ultima caja abierta
   * @returns caja abierta con datos previos lista para cerrar
   */
  async conseguirCajaAbierta(sucursalId: number) {
    const caja = await this.prisma.registroCaja.findFirst({
      where: { sucursalId, estado: EstadoTurnoCaja.ABIERTO, fechaCierre: null },
      select: {
        id: true,
        saldoInicial: true,
        comentario: true,
        fechaApertura: true,
        estado: true,
        sucursal: { select: { id: true, nombre: true } },
        usuarioInicio: { select: { id: true, nombre: true } },
      },
    });

    if (!caja) return null;

    return {
      id: caja.id,
      saldoInicial: Number(caja.saldoInicial),
      comentario: caja.comentario ?? undefined,
      fechaApertura: caja.fechaApertura,
      sucursalId: caja.sucursal.id,
      sucursalNombre: caja.sucursal.nombre,
      usuarioInicioId: caja.usuarioInicio.id,
      usuarioInicioNombre: caja.usuarioInicio.nombre,
      estado: caja.estado,
    };
  }

  /**
   *
   * @returns Registros de cajas cerrados con toda la data necesaria para entender los movimientos
   */
  async getCajasRegistros() {
    // try {
    //   const cajasRegistros = await this.prisma.registroCaja.findMany({
    //     where: {
    //       estado: 'CERRADO',
    //     },
    //     select: {
    //       id: true,
    //       comentario: true,
    //       estado: true,
    //       creadoEn: true,
    //       actualizadoEn: true,
    //       fechaApertura: true,
    //       fechaCierre: true,
    //       sucursal: true,
    //       movimientos: {
    //         include: {
    //           usuario: true,
    //         },
    //       },
    //       saldoFinal: true,
    //       saldoInicial: true,
    //       usuarioCierre: true,
    //       usuarioInicio: true,
    //       venta: {
    //         include: {
    //           cliente: true,
    //           productos: true,
    //           metodoPago: {
    //             select: {
    //               metodoPago: true,
    //             },
    //           },
    //         },
    //       },
    //     },
    //   });
    //   const cajasFormatt = cajasRegistros.map((c) => ({
    //     cajaID: c.id,
    //     cajaComentario: c.comentario,
    //     fechaApertura: c.fechaApertura,
    //     fechaCierre: c.fechaCierre,
    //     creadoEn: c.creadoEn,
    //     actualizadoEn: c.actualizadoEn,
    //     saldoInicial: c.saldoInicial,
    //     saldoFinal: c.saldoFinal,
    //     estado: c.estado,
    //     usuario: {
    //       id: c.usuarioInicio.id,
    //       nombre: c.usuarioInicio.nombre,
    //       rol: c.usuarioInicio.rol,
    //       correo: c.usuarioInicio.correo,
    //     },
    //     sucursal: {
    //       id: c.sucursal.id,
    //       nombre: c.sucursal.nombre,
    //     },
    //     ventasEnTurno: c.venta.map((v) => ({
    //       id: v.id,
    //       fechaVenta: v.fechaVenta,
    //       referenciaPago: v.referenciaPago,
    //       tipoComprobante: v.tipoComprobante,
    //       totalVenta: v.totalVenta,
    //       productos: v.productos.map((prod) => ({
    //         id: prod.id,
    //         cantidadVentida: prod.cantidad,
    //         precioVendido: prod.precioVenta,
    //         estado: prod.estado,
    //       })),
    //     })),
    //     movimientosEnTurno: c.movimientos.map((m) => ({
    //       id: m.id,
    //       banco: m.banco,
    //       fechaMovimiento: m.fecha,
    //       tipoDeMovimiento: m.tipo,
    //       categoriaDeMovimiento: m.categoria,
    //       creadoEn: m.creadoEn,
    //       actualizadoEn: m.actualizadoEn,
    //       descripcionMovimiento: m.descripcion,
    //       monto: m.monto,
    //       numeroBoleta: m.numeroBoleta,
    //       referencia: m.referencia,
    //       usadoParaCierre: m.usadoParaCierre,
    //       usuarioRegistra: {
    //         id: m.usuario.id,
    //         nombre: m.usuario.nombre,
    //         rol: m.usuario.rol,
    //       },
    //     })),
    //   }));
    //   return cajasFormatt;
    // } catch (err) {
    //   if (err instanceof BadRequestException) throw err;
    //   this.logger.error('Error cerrando caja:', err);
    //   throw new InternalServerErrorException('Error inesperado al cerrar caja');
    // }
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
  async previewCierre(params: {
    registroCajaId?: number;
    sucursalId?: number;
    usuarioId?: number; // opcional para filtrar por quien abrió
  }) {
    const { registroCajaId, sucursalId, usuarioId } = params;

    // 1) Resolver el turno
    let turno = null as null | {
      id: number;
      saldoInicial: any;
      fondoFijo: any;
      sucursalId: number;
    };

    if (registroCajaId) {
      turno = (await this.prisma.registroCaja.findUnique({
        where: { id: registroCajaId },
        select: {
          id: true,
          saldoInicial: true,
          fondoFijo: true,
          sucursalId: true,
          estado: true,
        },
      })) as any;

      if (!turno || (turno as any).estado !== EstadoTurnoCaja.ABIERTO) {
        throw new BadRequestException('Turno no encontrado o ya cerrado');
      }
    } else {
      if (!sucursalId) {
        throw new BadRequestException('Falta registroCajaId o sucursalId');
      }
      turno = (await this.prisma.registroCaja.findFirst({
        where: {
          sucursalId,
          estado: EstadoTurnoCaja.ABIERTO,
          fechaCierre: null,
          ...(usuarioId ? { usuarioInicioId: usuarioId } : {}),
        },
        orderBy: { fechaApertura: 'desc' },
        select: {
          id: true,
          saldoInicial: true,
          fondoFijo: true,
          sucursalId: true,
        },
      })) as any;

      if (!turno) throw new BadRequestException('No hay caja abierta');
    }

    // 2) Agregados por deltas
    const [sumAll, sumIn, sumOut, sumDepositosCierre] = await Promise.all([
      this.prisma.movimientoFinanciero.aggregate({
        _sum: { deltaCaja: true },
        where: { registroCajaId: turno.id },
      }),
      this.prisma.movimientoFinanciero.aggregate({
        _sum: { deltaCaja: true },
        where: { registroCajaId: turno.id, deltaCaja: { gt: 0 } },
      }),
      this.prisma.movimientoFinanciero.aggregate({
        _sum: { deltaCaja: true },
        where: { registroCajaId: turno.id, deltaCaja: { lt: 0 } },
      }),
      this.prisma.movimientoFinanciero.aggregate({
        _sum: { deltaCaja: true },
        where: {
          registroCajaId: turno.id,
          motivo: 'DEPOSITO_CIERRE',
          esDepositoCierre: true,
        },
      }),
    ]);

    const saldoInicial = Number(turno.saldoInicial ?? 0);
    const fondoFijo = Number(turno.fondoFijo ?? 0);
    const deltaCaja = Number(sumAll._sum.deltaCaja ?? 0);
    const enCaja = saldoInicial + deltaCaja;

    const ingresosEfectivo = Number(sumIn._sum.deltaCaja ?? 0); // (>0)
    const egresosEfectivo = Math.abs(Number(sumOut._sum.deltaCaja ?? 0)); // mostrar en positivo
    const depositosCierre = Math.abs(
      Number(sumDepositosCierre._sum.deltaCaja ?? 0),
    ); // también positivo

    const sugeridoDepositarAuto = Math.max(0, enCaja - fondoFijo);
    const puedeDepositarHasta = Math.max(0, enCaja);

    return {
      registroCajaId: turno.id,
      sucursalId: turno.sucursalId,
      saldoInicial,
      enCaja,
      fondoFijoActual: fondoFijo,
      sugeridoDepositarAuto,
      puedeDepositarHasta,
      desglose: {
        ingresosEfectivo, // suma de deltaCaja > 0
        egresosEfectivo, // suma abs(deltaCaja < 0)
        depositosCierre, // suma abs de depósitos de cierre
      },
      timestamp: new Date().toISOString(),
    };
  }

  async deleteAllCajas() {
    // await this.prisma.movimientoCaja.deleteMany({});
    await this.prisma.sucursalSaldoDiario.deleteMany({});
    await this.prisma.saldoGlobalDiario.deleteMany({});

    return this.prisma.registroCaja.deleteMany({});
  }

  async getAllCajas() {
    return await this.prisma.registroCaja.findMany({
      include: {
        movimientos: true,
      },
    });
  }

  //=============================================>
  /**
   * Obtiene el snapshot diario de saldo de una sucursal. Si no existe,
   * intenta recalcular mínimos usando cierres de caja del día.
   */
  async getSaldoDiario(sucursalId: number, fechaISO?: string) {
    //   try {
    //     const fecha = fechaISO ? new Date(fechaISO) : new Date();
    //     // normalizamos a inicio y fin del día
    //     const startOfDay = new Date(
    //       fecha.getFullYear(),
    //       fecha.getMonth(),
    //       fecha.getDate(),
    //     );
    //     const endOfDay = new Date(
    //       fecha.getFullYear(),
    //       fecha.getMonth(),
    //       fecha.getDate() + 1,
    //     );
    //     // 1) Buscar snapshot guardado del día
    //     const snap = await this.prisma.sucursalSaldoDiario.findFirst({
    //       where: { sucursalId, fechaGenerado: startOfDay },
    //       select: {
    //         saldoInicio: true,
    //         saldoFinal: true,
    //         totalIngresos: true,
    //         totalEgresos: true,
    //       },
    //     });
    //     if (snap) {
    //       // normalizamos por si vienen nulls desde DB
    //       return {
    //         saldoInicio: Number(snap.saldoInicio ?? 0),
    //         saldoFinal: Number(snap.saldoFinal ?? 0),
    //         totalIngresos:
    //           snap.totalIngresos === null ? null : Number(snap.totalIngresos),
    //         totalEgresos:
    //           snap.totalEgresos === null ? null : Number(snap.totalEgresos),
    //       };
    //     }
    //     // 2) Recalcular básico desde cierres de caja del día
    //     const cierres = await this.prisma.registroCaja.findMany({
    //       where: {
    //         sucursalId,
    //         fechaCierre: { gte: startOfDay, lt: endOfDay },
    //       },
    //       select: { saldoInicial: true, saldoFinal: true, id: true },
    //       orderBy: { fechaCierre: 'asc' },
    //     });
    //     const saldoInicio = cierres.length
    //       ? Number(cierres[0].saldoInicial ?? 0)
    //       : 0;
    //     const saldoFinal = cierres.length
    //       ? Number(cierres[cierres.length - 1].saldoFinal ?? 0)
    //       : 0;
    //     // Si más adelante quieres sumar ingresos/egresos del día, acá es el lugar:
    //     // const totalIngresos = await this.prisma.movimientoCaja.aggregate({...})
    //     // const totalEgresos = await this.prisma.movimientoCaja.aggregate({...})
    //     const totalIngresos: number | null = null;
    //     const totalEgresos: number | null = null;
    //     return { saldoInicio, saldoFinal, totalIngresos, totalEgresos };
    //   } catch (error) {
    //     console.error('[SucursalSaldoQueryService.getSaldoDiario]', error);
    //     throw new InternalServerErrorException(
    //       'Error al obtener el saldo diario',
    //     );
    //   }
    // }
  }

  /**
   * Sugerencia de saldo para abrir la próxima caja:
   * 1) Si hay turno ABIERTO en la sucursal => 0 (no debería abrirse otra caja).
   * 2) Si NO hay turno abierto:
   *    - Usa saldoFinal del ÚLTIMO turno CERRADO/ARQUEO (este ya incluye deltas).
   *    - Si no hay, usa snapshot diario (saldoFinalCaja si existe; fallback saldoFinal).
   *    - Si tampoco hay, 0.
   */
  async getUltimoSaldoSucursal(sucursalId: number): Promise<number> {
    // 1) Si hay turno ABIERTO, sugerimos 0 (evita doble apertura)
    const abierta = await this.prisma.registroCaja.findFirst({
      where: { sucursalId, estado: EstadoTurnoCaja.ABIERTO, fechaCierre: null },
      select: { id: true },
    });
    if (abierta) return 0;

    // 2) Último turno CERRADO/ARQUEO: su saldoFinal YA incluye deltas (incluye parciales)
    const ultima = await this.prisma.registroCaja.findFirst({
      where: {
        sucursalId,
        estado: { in: [EstadoTurnoCaja.CERRADO, EstadoTurnoCaja.ARQUEO] },
      },
      orderBy: { fechaCierre: 'desc' },
      select: { saldoFinal: true },
    });
    if (ultima?.saldoFinal != null) {
      const sf = Number(ultima.saldoFinal);
      return Math.abs(sf) < 0.01 ? 0 : sf;
    }

    // 3) Fallback: snapshot diario (tu modelo actual usa saldoFinalCaja)
    const snap = await this.prisma.sucursalSaldoDiario.findFirst({
      where: { sucursalId },
      orderBy: { fecha: 'desc' }, // tu campo de fecha en el snapshot
      select: { saldoFinalCaja: true }, // <-- ¡Úsalo, no 'saldoFinal'!
    });

    return snap ? Number(snap.saldoFinalCaja) : 0;
  }

  //NUEVO GET CAJAS A TABLE
  // ---------- LISTADO PRINCIPAL ----------
  async list(dto: GetCajasQueryDto): Promise<Paginated<any>> {
    const page = dto.page && dto.page > 0 ? dto.page : 1;
    const limit = dto.limit && dto.limit > 0 ? dto.limit : 10;
    const skip = (page - 1) * limit;

    const whereCaja: Prisma.RegistroCajaWhereInput = {};

    if (dto.sucursalId) whereCaja.sucursalId = dto.sucursalId;
    if (dto.estado) whereCaja.estado = dto.estado as EstadoTurnoCaja;

    if (typeof dto.depositado === 'string') {
      whereCaja.depositado = dto.depositado === 'true';
    }

    if (dto.fechaAperturaInicio || dto.fechaAperturaFin) {
      whereCaja.fechaApertura = {
        gte: dto.fechaAperturaInicio
          ? new Date(dto.fechaAperturaInicio)
          : undefined,
        lte: dto.fechaAperturaFin ? new Date(dto.fechaAperturaFin) : undefined,
      };
    }
    if (dto.fechaCierreInicio || dto.fechaCierreFin) {
      whereCaja.fechaCierre = {
        gte: dto.fechaCierreInicio
          ? new Date(dto.fechaCierreInicio)
          : undefined,
        lte: dto.fechaCierreFin ? new Date(dto.fechaCierreFin) : undefined,
      };
    }

    // Si hay filtros de movimiento, que al menos UNO matchee
    const movWhere = this.buildMovWhere(dto);
    if (Object.keys(movWhere).length) {
      whereCaja.movimientos = { some: movWhere };
    }

    const total = await this.prisma.registroCaja.count({ where: whereCaja });

    const cajas = await this.prisma.registroCaja.findMany({
      where: whereCaja,
      orderBy: { fechaApertura: 'desc' },
      skip,
      take: Number(limit),
      include: {
        sucursal: { select: { id: true, nombre: true } },
        usuarioInicio: { select: { id: true, nombre: true, correo: true } },
        usuarioCierre: { select: { id: true, nombre: true, correo: true } },
        movimientos: {
          where: Object.keys(movWhere).length ? movWhere : undefined,
          orderBy: { fecha: 'asc' },
          select: {
            id: true,
            creadoEn: true,
            actualizadoEn: true,
            fecha: true,
            descripcion: true,
            referencia: true,
            deltaCaja: true,
            deltaBanco: true,
            clasificacion: true,
            motivo: true,
            metodoPago: true,
            esDepositoCierre: true,
            esDepositoProveedor: true,
            cuentaBancaria: {
              select: { id: true, banco: true, alias: true, numero: true },
            },
            proveedor: { select: { id: true, nombre: true } },
            usuario: { select: { id: true, nombre: true, correo: true } },
          },
        },
        venta: {
          orderBy: { fechaVenta: 'asc' },
          select: {
            id: true,
            totalVenta: true,
            tipoComprobante: true,
            metodoPago: true,
            fechaVenta: true,
            referenciaPago: true,
            cliente: { select: { id: true, nombre: true } },
            productos: {
              select: {
                id: true,
                cantidad: true,
                precioVenta: true,
                estado: true,
                producto: {
                  select: {
                    id: true,
                    nombre: true,
                    descripcion: true,
                    codigoProducto: true,
                    imagenesProducto: {
                      select: { id: true, public_id: true, url: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const items = cajas.map((rc) => {
      const movimientos = rc.movimientos.map((m) => {
        const tipo = this.inferTipo(m);
        const categoria = this.inferCategoria(m);
        const monto = this.montoDesdeDeltas(m);

        const banco = m.cuentaBancaria?.banco
          ? m.cuentaBancaria.banco
          : (m.cuentaBancaria?.alias ?? null);

        return {
          id: m.id,
          creadoEn: m.creadoEn.toISOString(),
          actualizadoEn: m.actualizadoEn.toISOString(),
          banco,
          categoria,
          descripcion: m.descripcion ?? null,
          fecha: m.fecha.toISOString(),
          monto,
          numeroBoleta: this.maybeBoleta(m.referencia),
          referencia: m.referencia ?? null,
          tipo, // <- legacy TipoMovimientoCaja compatible
          usadoParaCierre: !!(
            m.esDepositoCierre || m.motivo === 'DEPOSITO_CIERRE'
          ),
          proveedor: m.proveedor
            ? { id: m.proveedor.id, nombre: m.proveedor.nombre }
            : null,
          usuario: m.usuario
            ? {
                id: m.usuario.id,
                nombre: m.usuario.nombre,
                correo: m.usuario.correo,
              }
            : null,
          // Nota: si alguna vez necesitas el signo real en FE, podemos agregar deltaCaja/deltaBanco como campos opcionales.
        };
      });

      const ventas = rc.venta.map((v) => ({
        id: v.id,
        totalVenta: this.toNum(v.totalVenta),
        tipoComprobante: v.tipoComprobante,
        metodoPago: v.metodoPago,
        fechaVenta: v.fechaVenta.toISOString(),
        referenciaPago: v.referenciaPago ?? 'N/A',
        cliente: v.cliente
          ? { id: v.cliente.id, nombre: v.cliente.nombre }
          : 'CF',
        productos: v.productos.map((vp, idx) => ({
          id: vp.id,
          cantidad: vp.cantidad,
          precioVenta: this.toNum(vp.precioVenta),
          estado: vp.estado,
          producto: {
            id: vp.producto.id,
            nombre: vp.producto.nombre,
            descripcion: vp.producto.descripcion,
            codigoProducto: vp.producto.codigoProducto,
            imagenesProducto: (vp.producto.imagenesProducto ?? []).map(
              (img, i) => ({
                id: img.id ?? i,
                public_id: img.public_id,
                url: img.url,
              }),
            ),
          },
        })),
      }));

      return {
        id: rc.id,
        creadoEn: rc.creadoEn.toISOString(),
        actualizadoEn: rc.actualizadoEn.toISOString(),
        comentarioInicial: rc.comentario ?? null,
        comentarioFinal: rc.comentarioFinal ?? null,
        depositado: rc.depositado,
        estado: rc.estado, // EstadoTurnoCaja -> string
        fechaApertura: rc.fechaApertura.toISOString(),
        fechaCierre: rc.fechaCierre
          ? rc.fechaCierre.toISOString()
          : (null as any),
        movimientoCaja: null,
        saldoInicial: this.toNum(rc.saldoInicial),
        saldoFinal: rc.saldoFinal == null ? 0 : this.toNum(rc.saldoFinal),
        ventasLenght: ventas.length,
        movimientosLenght: movimientos.length,
        usuarioInicio: rc.usuarioInicio
          ? {
              id: rc.usuarioInicio.id,
              nombre: rc.usuarioInicio.nombre,
              correo: rc.usuarioInicio.correo,
            }
          : null,
        usuarioCierre: rc.usuarioCierre
          ? {
              id: rc.usuarioCierre.id,
              nombre: rc.usuarioCierre.nombre,
              correo: rc.usuarioCierre.correo,
            }
          : null,
        sucursal: { id: rc.sucursal.id, nombre: rc.sucursal.nombre },
        movimientosCaja: movimientos,
        ventas,
      };
    });

    return {
      total,
      page,
      limit,
      pages: Math.max(1, Math.ceil(total / limit)),
      items,
    };
  }

  //VINCULAR CON CAJA TURNO
  // En tu CajaService o un “VentasFinanzasService”
  async attachAndRecordSaleTx(
    tx: Prisma.TransactionClient,
    ventaId: number,
    sucursalId: number,
    usuarioId: number, // quien registró la venta
    opts?: { exigirCajaSiEfectivo?: boolean },
  ) {
    const { exigirCajaSiEfectivo = true } = opts ?? {};

    // 1) traigo venta con método de pago
    const venta = await tx.venta.findUnique({
      where: { id: ventaId },
      select: {
        id: true,
        totalVenta: true,
        registroCajaId: true,
        sucursalId: true,
        referenciaPago: true,
        usuarioId: true,
        metodoPago: { select: { metodoPago: true } }, // string enum: CONTADO | TRANSFERENCIA | TARJETA | CREDITO...
      },
    });
    if (!venta) throw new NotFoundException('Venta no encontrada');

    const metodo = venta.metodoPago?.metodoPago ?? 'CONTADO';
    const requiereCaja = metodo === 'CONTADO' && venta.totalVenta > 0;

    let registroCajaId: number | null = venta.registroCajaId ?? null;

    // 2) si es CONTADO, asegurar caja abierta y linkear
    if (requiereCaja) {
      // busca caja abierta
      const cajaAbierta = await tx.registroCaja.findFirst({
        where: { sucursalId, estado: 'ABIERTO', fechaCierre: null },
        orderBy: { fechaApertura: 'desc' },
        select: { id: true },
      });

      if (!cajaAbierta) {
        if (exigirCajaSiEfectivo) {
          throw new BadRequestException(
            'No hay caja abierta para venta en efectivo.',
          );
        }
      } else {
        // lock & recheck
        await tx.$executeRaw`SET LOCAL lock_timeout = '3s'`;
        await tx.$queryRaw`
        SELECT id FROM "RegistroCaja"
        WHERE id = ${cajaAbierta.id}
        FOR UPDATE NOWAIT
      `;
        // linkear si aún no estaba linkeada
        await tx.venta.updateMany({
          where: { id: venta.id, registroCajaId: null },
          data: { registroCajaId: cajaAbierta.id },
        });
        const linked = await tx.venta.findUnique({
          where: { id: venta.id },
          select: { registroCajaId: true },
        });
        registroCajaId = linked?.registroCajaId ?? null;
      }
    }

    // 3) Crear MovimientoFinanciero desde la venta (una sola verdad contable)
    //    - CONTADO: deltaCaja +total
    //    - TARJETA/TRANSFERENCIA: deltaBanco +total
    //    - CREDITO: no crear movimiento (se creará al cobrar)
    if (metodo !== 'CREDITO' && venta.totalVenta > 0) {
      const esEfectivo = metodo === 'CONTADO';
      await tx.movimientoFinanciero.create({
        data: {
          fecha: new Date(),
          sucursalId,
          registroCajaId: esEfectivo ? registroCajaId : null,
          clasificacion: 'INGRESO',
          motivo: 'VENTA',
          metodoPago: metodo,
          deltaCaja: esEfectivo ? venta.totalVenta : 0,
          deltaBanco: !esEfectivo ? venta.totalVenta : 0,
          descripcion: `Venta #${venta.id}`,
          referencia: venta.referenciaPago ?? null,
          usuarioId: usuarioId ?? venta.usuarioId,
          // extras que te sirven para filtros:
          esDepositoCierre: false,
          esDepositoProveedor: false,
          afectaInventario: false, // inventario lo llevas en HistorialStock
        },
      });
    }

    return { ventaId: venta.id, registroCajaId };
  }
}
