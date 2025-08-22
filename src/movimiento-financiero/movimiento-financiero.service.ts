import {
  BadRequestException,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateMovimientoFinancieroDto } from './dto/create-movimiento-financiero.dto';
import { UpdateMovimientoFinancieroDto } from './dto/update-movimiento-financiero.dto';
import {
  ClasificacionAdmin,
  EstadoTurnoCaja,
  MotivoMovimiento,
  Prisma,
} from '@prisma/client';
import { CrearMovimientoDto } from './dto/crear-movimiento.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilitiesService } from 'src/utilities/utilities.service';
type Tx = Prisma.TransactionClient;
@Injectable()
export class MovimientoFinancieroService {
  private readonly logger = new Logger(MovimientoFinancieroService.name);
  constructor(
    private prisma: PrismaService,
    private readonly utilities: UtilitiesService,
  ) {}

  async crearMovimiento(dto: CrearMovimientoDto) {
    this.logger.debug('DTO crear movimiento:', dto);

    const { sucursalId, usuarioId, motivo, monto } = dto;
    if (!sucursalId || !usuarioId) {
      throw new BadRequestException('sucursalId y usuarioId son obligatorios');
    }
    if (monto <= 0) throw new BadRequestException('monto inválido');

    // 0) Normalizar método de pago ANTES del mapeo
    if (!dto.metodoPago) {
      if (motivo === 'DEPOSITO_CIERRE' || motivo === 'PAGO_PROVEEDOR_BANCO') {
        dto.metodoPago = 'TRANSFERENCIA';
      } else {
        dto.metodoPago = dto.cuentaBancariaId ? 'TRANSFERENCIA' : 'EFECTIVO';
      }
    }

    // 1) Derivar clasificación y deltas (no toca DB)
    const { clasificacion, deltaCaja, deltaBanco } =
      this.mapMotivoToEffects(dto);
    const afectaCaja = Number(deltaCaja) !== 0;
    const afectaBanco = Number(deltaBanco) !== 0;

    if (!afectaCaja && !afectaBanco) {
      throw new BadRequestException(
        'El movimiento no afecta ni caja ni banco.',
      );
    }

    // 2) Coherencia método de pago ↔ efectos
    const esDepositoCierre =
      dto.motivo === 'DEPOSITO_CIERRE' || !!dto.esDepositoCierre;

    if (dto.metodoPago === 'EFECTIVO' && afectaBanco) {
      throw new BadRequestException('Efectivo no puede afectar banco.');
    }
    if (dto.metodoPago !== 'EFECTIVO' && afectaCaja && !esDepositoCierre) {
      throw new BadRequestException(
        'Un movimiento no-efectivo no debe afectar caja (salvo depósito de cierre).',
      );
    }

    // 3) Transacción: todo lo que mire/grabe en DB va adentro
    return this.prisma.$transaction(
      async (tx: Tx) => {
        // 3.1) Resolver/validar turno dentro de la transacción
        let registroCajaId: number | null = dto.registroCajaId ?? null;

        if (afectaCaja) {
          if (!registroCajaId) {
            const abierto = await tx.registroCaja.findFirst({
              where: {
                sucursalId,
                estado: EstadoTurnoCaja.ABIERTO,
                fechaCierre: null,
              },
              select: { id: true, sucursalId: true },
            });
            if (!abierto) {
              throw new BadRequestException(
                'No hay caja abierta para movimientos con efectivo.',
              );
            }
            registroCajaId = abierto.id;
          } else {
            const turno = await tx.registroCaja.findUnique({
              where: { id: registroCajaId },
              select: { id: true, estado: true, sucursalId: true },
            });
            if (
              !turno ||
              turno.estado !== EstadoTurnoCaja.ABIERTO ||
              turno.sucursalId !== sucursalId
            ) {
              throw new BadRequestException(
                'Turno inválido para este movimiento.',
              );
            }
          }
        } else {
          if (registroCajaId) {
            throw new BadRequestException(
              'Movimientos solo bancarios no deben adjuntar registroCajaId.',
            );
          }
        }

        // 3.2) Reglas de banco dentro de la transacción
        if (afectaBanco) {
          if (!dto.cuentaBancariaId) {
            throw new BadRequestException(
              'Cuenta bancaria requerida para movimientos bancarios.',
            );
          }
        } else {
          if (dto.cuentaBancariaId) {
            throw new BadRequestException(
              'No envíes cuenta bancaria si el movimiento no afecta banco.',
            );
          }
        }

        // 3.3) Reglas especiales
        if (esDepositoCierre) {
          if (!(deltaCaja < 0 && deltaBanco > 0)) {
            throw new BadRequestException(
              'Depósito de cierre debe mover caja(-) y banco(+).',
            );
          }
          if (!registroCajaId) {
            throw new BadRequestException(
              'Depósito de cierre requiere turno de caja.',
            );
          }
          if (!dto.cuentaBancariaId) {
            throw new BadRequestException(
              'Depósito de cierre requiere cuenta bancaria de destino.',
            );
          }
        }

        if (dto.esDepositoProveedor) {
          if (
            !(
              afectaCaja &&
              deltaCaja < 0 &&
              !afectaBanco &&
              clasificacion === ClasificacionAdmin.COSTO_VENTA
            )
          ) {
            throw new BadRequestException(
              'Depósito a proveedor debe ser egreso de caja y costo de venta.',
            );
          }
        }

        // 3.4) PRE-GUARDS de efectivo (anti caja negativa)
        if (afectaCaja && registroCajaId) {
          await this.utilities.validarMovimientoEfectivo(
            tx,
            registroCajaId,
            Number(deltaCaja),
          );

          if (esDepositoCierre) {
            const montoAbs = Math.abs(Number(deltaCaja)); // deltaCaja < 0
            await this.utilities.validarDepositoCierre(
              tx,
              registroCajaId,
              montoAbs,
            );
          }
        }

        // 3.5) Crear movimiento
        const mov = await tx.movimientoFinanciero.create({
          data: {
            sucursalId,
            registroCajaId,
            clasificacion,
            motivo,
            metodoPago: dto.metodoPago ?? null,
            deltaCaja,
            deltaBanco,
            cuentaBancariaId: dto.cuentaBancariaId ?? null,
            descripcion: dto.descripcion ?? null,
            referencia: dto.referencia ?? null,
            esDepositoCierre: !!dto.esDepositoCierre,
            esDepositoProveedor: !!dto.esDepositoProveedor,
            proveedorId: dto.proveedorId ?? null,
            gastoOperativoTipo: (dto.gastoOperativoTipo as any) ?? null,
            costoVentaTipo: (dto.costoVentaTipo as any) ?? null,
            afectaInventario: this.afectaInventario(motivo),
            usuarioId,
          },
        });

        // 3.6) POST-CHECK: revalidar que la caja no quedó negativa
        if (afectaCaja && registroCajaId) {
          const { enCaja } = await this.utilities.getCajaEstado(
            tx,
            registroCajaId,
          );
          if (enCaja < 0) {
            throw new Error('Caja negativa tras el movimiento; rollback.');
          }
        }

        return mov;
      },
      {
        // Si tu motor lo soporta, esto minimiza condiciones de carrera
        isolationLevel: 'Serializable',
      },
    );
  }

  private mapMotivoToEffects(dto: CrearMovimientoDto) {
    const m = dto.motivo;
    const x = dto.monto;

    // Defaults
    let clasificacion: ClasificacionAdmin = ClasificacionAdmin.TRANSFERENCIA;
    let deltaCaja = 0,
      deltaBanco = 0;
    let necesitaTurno = false;

    switch (m) {
      case MotivoMovimiento.VENTA:
        clasificacion = ClasificacionAdmin.INGRESO;
        if (dto.metodoPago === 'EFECTIVO') {
          deltaCaja = +x;
          necesitaTurno = true;
        } else {
          deltaBanco = +x;
        }
        break;

      case MotivoMovimiento.OTRO_INGRESO:
        clasificacion = ClasificacionAdmin.INGRESO;
        if (dto.metodoPago === 'EFECTIVO') {
          deltaCaja = +x;
          necesitaTurno = true;
        } else {
          deltaBanco = +x;
        }
        break;

      case MotivoMovimiento.GASTO_OPERATIVO:
        clasificacion = ClasificacionAdmin.GASTO_OPERATIVO;
        if (dto.metodoPago === 'EFECTIVO') {
          deltaCaja = -x;
          necesitaTurno = true;
        } else {
          deltaBanco = -x;
        }
        break;

      case MotivoMovimiento.COMPRA_MERCADERIA:
      case MotivoMovimiento.COSTO_ASOCIADO:
        clasificacion = ClasificacionAdmin.COSTO_VENTA;
        if (dto.metodoPago === 'EFECTIVO') {
          deltaCaja = -x;
          necesitaTurno = true;
        } else {
          deltaBanco = -x;
        } // pago desde banco
        break;

      case MotivoMovimiento.DEPOSITO_CIERRE:
        clasificacion = ClasificacionAdmin.TRANSFERENCIA;
        deltaCaja = -x;
        deltaBanco = +x;
        necesitaTurno = true;
        break;

      case MotivoMovimiento.DEPOSITO_PROVEEDOR:
        clasificacion = ClasificacionAdmin.COSTO_VENTA;
        deltaCaja = -x;
        deltaBanco = 0;
        necesitaTurno = true;
        break;

      case MotivoMovimiento.PAGO_PROVEEDOR_BANCO:
        clasificacion = ClasificacionAdmin.COSTO_VENTA;
        deltaCaja = 0;
        deltaBanco = -x;
        break;

      case MotivoMovimiento.AJUSTE_SOBRANTE:
        clasificacion = ClasificacionAdmin.AJUSTE;
        deltaCaja = +x;
        necesitaTurno = true;
        break;

      case MotivoMovimiento.AJUSTE_FALTANTE:
        clasificacion = ClasificacionAdmin.AJUSTE;
        deltaCaja = -x;
        necesitaTurno = true;
        break;

      case MotivoMovimiento.DEVOLUCION:
        clasificacion = ClasificacionAdmin.CONTRAVENTA;
        if (dto.metodoPago === 'EFECTIVO') {
          deltaCaja = -x;
          necesitaTurno = true;
        } else {
          deltaBanco = -x;
        }
        break;

      default:
        throw new BadRequestException('Motivo no soportado');
    }

    return { clasificacion, deltaCaja, deltaBanco, necesitaTurno };
  }

  private afectaInventario(motivo: MotivoMovimiento) {
    return motivo === MotivoMovimiento.COMPRA_MERCADERIA; // recepción de compra
  }

  create(createMovimientoFinancieroDto: CreateMovimientoFinancieroDto) {
    return 'This action adds a new movimientoFinanciero';
  }

  findAll() {
    return `This action returns all movimientoFinanciero`;
  }

  async getMovimientosFinancierosSimple() {
    return this.prisma.movimientoFinanciero.findMany({
      include: {
        cuentaBancaria: true,
        registroCaja: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} movimientoFinanciero`;
  }

  update(
    id: number,
    updateMovimientoFinancieroDto: UpdateMovimientoFinancieroDto,
  ) {
    return `This action updates a #${id} movimientoFinanciero`;
  }

  remove(id: number) {
    return `This action removes a #${id} movimientoFinanciero`;
  }
}
