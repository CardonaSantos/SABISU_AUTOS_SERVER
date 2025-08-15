import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovimientosCajaDto } from './dto/create-movimientos-caja.dto';
import { UpdateMovimientosCajaDto } from './dto/update-movimientos-caja.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PageOptionsDto } from 'src/utils/page-options';
import {
  CategoriaMovimiento,
  Prisma,
  TipoMovimientoCaja,
} from '@prisma/client';
import { MovimientosQueryDto } from './dto/movimientos-query.dto';

@Injectable()
export class MovimientosCajasService {
  private readonly logger = new Logger(MovimientosCajasService.name);
  constructor(private readonly prisma: PrismaService) {}

  /**
   *
   * @param query Query en formato QS para traer registros de movmientos
   * @returns
   */
  async getMovimientosCaja(query: MovimientosQueryDto) {
    try {
      const page = Number(query.page ?? 1);
      const limit = Number(query.limit ?? 10);
      const skip = (page - 1) * limit;
      // ---- WHERE dinámico (sucursal, tipo, categoría, fechas, search)
      const { sucursalId, tipo, categoria, fechaInicio, fechaFin, search } =
        query;

      const tipos = Array.isArray(tipo) ? tipo : tipo ? [tipo] : [];
      const categorias = Array.isArray(categoria)
        ? categoria
        : categoria
          ? [categoria]
          : [];

      const where: Prisma.MovimientoCajaWhereInput = {
        // Si hay tipos, usa filtro { in: [...] }, si no, no añadas nada
        ...(tipos.length
          ? { tipo: { in: tipos as TipoMovimientoCaja[] } }
          : {}),

        ...(categorias.length
          ? { categoria: { in: categorias as CategoriaMovimiento[] } }
          : {}),

        ...(fechaInicio || fechaFin
          ? {
              fecha: {
                ...(fechaInicio ? { gte: new Date(fechaInicio) } : {}),
                ...(fechaFin ? { lte: new Date(fechaFin) } : {}),
              },
            }
          : {}),

        ...(search
          ? {
              OR: [
                { descripcion: { contains: search, mode: 'insensitive' } },
                { numeroBoleta: { contains: search, mode: 'insensitive' } },
                { referencia: { contains: search, mode: 'insensitive' } },
                { banco: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {}),

        ...(sucursalId
          ? { registroCaja: { sucursalId: Number(sucursalId) } }
          : {}),
      };

      const [total, registros] = await this.prisma.$transaction([
        this.prisma.movimientoCaja.count({ where }),
        this.prisma.movimientoCaja.findMany({
          where,
          take: limit,
          skip,
          orderBy: { creadoEn: 'desc' },
          select: {
            id: true,
            creadoEn: true,
            actualizadoEn: true,
            banco: true,
            categoria: true,
            descripcion: true,
            fecha: true,
            monto: true,
            numeroBoleta: true,
            tipo: true,
            usadoParaCierre: true,
            referencia: true,
            usuario: {
              select: {
                id: true,
                nombre: true,
                correo: true,
                rol: true,
              },
            },
            proveedor: {
              select: {
                id: true,
                nombre: true,
              },
            },
            registroCaja: {
              select: {
                id: true,
                fechaApertura: true,
                fechaCierre: true,
                comentario: true,
                comentarioFinal: true,
                saldoInicial: true,
                saldoFinal: true,
                // Para agrupar/mostrar sucursal
                sucursal: { select: { id: true, nombre: true } },
                estado: true,
                depositado: true,
                creadoEn: true,
                actualizadoEn: true,
              },
            },
          },
        }),
      ]);

      const items = registros.map((m) => ({
        id: m.id,
        creadoEn: m.creadoEn,
        actualizadoEn: m.actualizadoEn,
        banco: m.banco ?? null,
        categoria: m.categoria ?? null,
        descripcion: m.descripcion ?? null,
        fecha: m.fecha,
        monto: m.monto,
        numeroBoleta: m.numeroBoleta ?? null,
        referencia: m.referencia ?? null,
        tipo: m.tipo,
        usadoParaCierre: m.usadoParaCierre ?? false,

        usuario: m.usuario
          ? {
              id: m.usuario.id,
              nombre: m.usuario.nombre,
              rol: m.usuario.rol,
              correo: m.usuario.correo,
            }
          : null,

        proveedor: m.proveedor
          ? {
              id: m.proveedor.id,
              nombre: m.proveedor.nombre,
            }
          : null,

        caja: m.registroCaja
          ? {
              id: m.registroCaja.id,
              comentario: m.registroCaja.comentario ?? null,
              comentarioFinal: m.registroCaja.comentarioFinal ?? null,
              fechaApertura: m.registroCaja.fechaApertura,
              fechaCierre: m.registroCaja.fechaCierre,
              saldoInicial: m.registroCaja.saldoInicial,
              saldoFinal: m.registroCaja.saldoFinal,

              estado: m.registroCaja.estado,
              depositado: m.registroCaja.depositado,
              creadoEn: m.registroCaja.creadoEn,
              actualizadoEn: m.registroCaja.actualizadoEn,

              sucursal: m.registroCaja.sucursal
                ? {
                    id: m.registroCaja.sucursal.id,
                    nombre: m.registroCaja.sucursal.nombre,
                  }
                : null,
            }
          : null,
      }));

      // Agrupado opcional por sucursal como en registros de caja
      if ((query as any).groupBySucursal) {
        const agrupado = items.reduce<
          Record<
            number,
            {
              sucursal: { id: number; nombre: string } | null;
              movimientos: typeof items;
            }
          >
        >((acc, it) => {
          const key = (it.caja?.sucursal?.id as number | undefined) ?? -1; // -1 para "sin sucursal"
          if (!acc[key])
            acc[key] = {
              sucursal: it.caja?.sucursal ?? null,
              movimientos: [] as any,
            };
          acc[key].movimientos.push(it);
          return acc;
        }, {});
        return {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
          itemsBySucursal: Object.values(agrupado),
        };
      }

      return {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        items,
      };
    } catch (error) {
      this.logger.error(`El error es: ${error}`);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Fatal error: Error inesperado');
    }
  }

  /**
   * Obtiene un movimiento de caja por ID, con datos relevantes de caja/sucursal/usuarios.
   */
  async getMovimientoCajaById(id: number) {
    try {
      const m = await this.prisma.movimientoCaja.findUnique({
        where: { id: Number(id) },
        select: {
          id: true,
          creadoEn: true,
          actualizadoEn: true,
          banco: true,
          categoria: true,
          descripcion: true,
          fecha: true,
          monto: true,
          numeroBoleta: true,
          referencia: true,
          tipo: true,
          usadoParaCierre: true,

          usuario: {
            select: { id: true, nombre: true, correo: true, rol: true },
          },
          proveedor: {
            select: { id: true, nombre: true },
          },

          registroCaja: {
            select: {
              id: true,
              comentario: true,
              comentarioFinal: true,
              fechaApertura: true,
              fechaCierre: true,
              saldoInicial: true,
              saldoFinal: true,
              estado: true,
              depositado: true,
              creadoEn: true,
              actualizadoEn: true,
              sucursal: { select: { id: true, nombre: true } },
              usuarioInicio: {
                select: { id: true, nombre: true, correo: true },
              },
              usuarioCierre: {
                select: { id: true, nombre: true, correo: true },
              },
            },
          },
        },
      });

      if (!m)
        throw new NotFoundException(`Movimiento de caja #${id} no encontrado`);

      // Map null-safe y con nombres consistentes con la UI
      const item = {
        id: m.id,
        creadoEn: m.creadoEn,
        actualizadoEn: m.actualizadoEn,
        banco: m.banco ?? null,
        categoria: m.categoria ?? null,
        descripcion: m.descripcion ?? null,
        fecha: m.fecha,
        monto: m.monto,
        numeroBoleta: m.numeroBoleta ?? null,
        referencia: m.referencia ?? null,
        tipo: m.tipo,
        usadoParaCierre: m.usadoParaCierre ?? false,

        usuario: m.usuario
          ? {
              id: m.usuario.id,
              nombre: m.usuario.nombre,
              rol: m.usuario.rol,
              correo: m.usuario.correo,
            }
          : null,

        proveedor: m.proveedor
          ? { id: m.proveedor.id, nombre: m.proveedor.nombre }
          : null,

        caja: m.registroCaja
          ? {
              id: m.registroCaja.id,
              comentario: m.registroCaja.comentario ?? null,
              comentarioFinal: m.registroCaja.comentarioFinal ?? null,
              fechaApertura: m.registroCaja.fechaApertura,
              fechaCierre: m.registroCaja.fechaCierre,
              saldoInicial: m.registroCaja.saldoInicial,
              saldoFinal: m.registroCaja.saldoFinal,
              estado: m.registroCaja.estado,
              depositado: m.registroCaja.depositado,
              creadoEn: m.registroCaja.creadoEn,
              actualizadoEn: m.registroCaja.actualizadoEn,
              sucursal: m.registroCaja.sucursal
                ? {
                    id: m.registroCaja.sucursal.id,
                    nombre: m.registroCaja.sucursal.nombre,
                  }
                : null,
              usuarioInicio: m.registroCaja.usuarioInicio
                ? {
                    id: m.registroCaja.usuarioInicio.id,
                    nombre: m.registroCaja.usuarioInicio.nombre,
                    correo: m.registroCaja.usuarioInicio.correo,
                  }
                : null,
              usuarioCierre: m.registroCaja.usuarioCierre
                ? {
                    id: m.registroCaja.usuarioCierre.id,
                    nombre: m.registroCaja.usuarioCierre.nombre,
                    correo: m.registroCaja.usuarioCierre.correo,
                  }
                : null,
            }
          : null,
      };

      return item;
    } catch (error) {
      this.logger.error(`Error al obtener movimiento: ${error}`);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Fatal error: Error inesperado');
    }
  }
}
