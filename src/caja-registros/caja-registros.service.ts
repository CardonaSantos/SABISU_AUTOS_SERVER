import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCajaRegistroDto } from './dto/create-caja-registro.dto';
import { UpdateCajaRegistroDto } from './dto/update-caja-registro.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TimeoutError } from 'rxjs';
import { Prisma } from '@prisma/client';
import { PageOptionsDto } from 'src/utils/page-options';
import { CajaRegistrosQueryDto } from './dto/dto-caja-request';

@Injectable()
export class CajaRegistrosService {
  private logger = new Logger(CajaRegistrosService.name);
  constructor(private readonly prisma: PrismaService) {}

  /**
   *
   * @param pageOptionsDTO Props para limites y paginacion
   * @returns registros de cajas
   */
  async getRegistrosCajas(pageOptions: CajaRegistrosQueryDto) {
    try {
      const page = Number(pageOptions.page ?? 1);
      const limit = Number(pageOptions.limit ?? 10);
      const skip = (page - 1) * limit;

      const {
        sucursalId,
        estado,
        depositado,
        fechaAperturaInicio,
        fechaAperturaFin,
        fechaCierreInicio,
        fechaCierreFin,

        // filtros de movimientos
        tipo,
        categoria,
        fechaMovInicio,
        fechaMovFin,
        search,
      } = pageOptions;

      // ---- WHERE para movimientos (se usa dentro del where principal y también en el select de movimientos)
      const movWhere: Prisma.MovimientoCajaWhereInput = {
        ...(tipo
          ? Array.isArray(tipo)
            ? { tipo: { in: tipo as any[] } }
            : { tipo: tipo as any }
          : {}),
        ...(categoria
          ? Array.isArray(categoria)
            ? { categoria: { in: categoria as any[] } }
            : { categoria: categoria as any }
          : {}),
        ...(fechaMovInicio || fechaMovFin
          ? {
              fecha: {
                ...(fechaMovInicio ? { gte: new Date(fechaMovInicio) } : {}),
                ...(fechaMovFin ? { lte: new Date(fechaMovFin) } : {}),
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
      };

      // ¿Hay filtros efectivos de movimiento?
      const hasMovFilters =
        !!tipo || !!categoria || !!fechaMovInicio || !!fechaMovFin || !!search;

      // ---- WHERE principal de RegistroCaja (usa nested filters sobre movimientos cuando aplica)
      const where: Prisma.RegistroCajaWhereInput = {
        ...(sucursalId ? { sucursalId: Number(sucursalId) } : {}),
        ...(estado ? { estado } : {}),
        ...(typeof depositado === 'boolean' ? { depositado } : {}),
        ...(fechaAperturaInicio || fechaAperturaFin
          ? {
              fechaApertura: {
                ...(fechaAperturaInicio
                  ? { gte: new Date(fechaAperturaInicio) }
                  : {}),
                ...(fechaAperturaFin
                  ? { lte: new Date(fechaAperturaFin) }
                  : {}),
              },
            }
          : {}),
        ...(fechaCierreInicio || fechaCierreFin
          ? {
              fechaCierre: {
                ...(fechaCierreInicio
                  ? { gte: new Date(fechaCierreInicio) }
                  : {}),
                ...(fechaCierreFin ? { lte: new Date(fechaCierreFin) } : {}),
              },
            }
          : {}),
        ...(search
          ? {
              OR: [
                { comentario: { contains: search, mode: 'insensitive' } },
                { comentarioFinal: { contains: search, mode: 'insensitive' } },
                // también deja buscar por fields de movimientos
                { movimientos: { some: movWhere } },
              ],
            }
          : {}),
        ...(hasMovFilters
          ? {
              movimientos: { some: movWhere },
            }
          : {}),
      };

      const [total, cajas] = await this.prisma.$transaction([
        this.prisma.registroCaja.count({ where }),
        this.prisma.registroCaja.findMany({
          where,
          take: limit,
          skip,
          orderBy: { fechaApertura: 'desc' },
          select: {
            id: true,
            creadoEn: true,
            actualizadoEn: true,
            comentario: true,
            comentarioFinal: true,
            depositado: true,
            estado: true,
            fechaApertura: true,
            fechaCierre: true,
            movimientoCaja: true,
            saldoInicial: true,
            saldoFinal: true,

            movimientos: {
              ...(hasMovFilters ? { where: movWhere } : {}),
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
                referencia: true,
                tipo: true,
                usadoParaCierre: true,
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
              },
            },

            sucursal: { select: { id: true, nombre: true } },

            usuarioInicio: {
              select: { id: true, nombre: true, correo: true },
            },
            usuarioCierre: {
              select: { id: true, nombre: true, correo: true },
            },

            venta: {
              orderBy: { fechaVenta: 'desc' },
              select: {
                id: true,
                totalVenta: true,
                fechaVenta: true,
                tipoComprobante: true,
                referenciaPago: true,
                metodoPago: { select: { metodoPago: true } },
                productos: {
                  select: {
                    id: true,
                    cantidad: true,
                    precioVenta: true,
                    estado: true,
                    producto: {
                      select: {
                        id: true,
                        codigoProducto: true,
                        nombre: true,
                        descripcion: true,
                        imagenesProducto: {
                          select: { id: true, public_id: true, url: true },
                        },
                      },
                    },
                  },
                },
                cliente: { select: { id: true, nombre: true } },
              },
            },
          },
        }),
      ]);

      const items = cajas.map((caja) => ({
        id: caja.id,
        creadoEn: caja.creadoEn,
        actualizadoEn: caja.actualizadoEn,
        comentarioInicial: caja.comentario ?? null,
        comentarioFinal: caja.comentarioFinal ?? null,
        depositado: caja.depositado,
        estado: caja.estado,
        fechaApertura: caja.fechaApertura,
        fechaCierre: caja.fechaCierre,
        movimientoCaja: caja.movimientoCaja,
        saldoInicial: caja.saldoInicial,
        saldoFinal: caja.saldoFinal,
        ventasLenght: caja.venta.length,
        movimientosLenght: caja.movimientos.length,

        usuarioInicio: caja.usuarioInicio
          ? {
              id: caja.usuarioInicio.id,
              nombre: caja.usuarioInicio.nombre,
              correo: caja.usuarioInicio.correo,
            }
          : null,

        usuarioCierre: caja.usuarioCierre
          ? {
              id: caja.usuarioCierre.id,
              nombre: caja.usuarioCierre.nombre,
              correo: caja.usuarioCierre.correo,
            }
          : null,

        sucursal: {
          id: caja.sucursal.id,
          nombre: caja.sucursal.nombre,
        },

        movimientosCaja: (caja.movimientos ?? []).map((m) => ({
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
          proveedor: m.proveedor
            ? { id: m.proveedor.id, nombre: m.proveedor.nombre }
            : null,
          usuario: m.usuario
            ? {
                id: m.usuario.id,
                nombre: m.usuario.nombre,
                rol: m.usuario.rol,
                correo: m.usuario.correo,
              }
            : null,
        })),

        ventas: (caja.venta ?? []).map((v) => ({
          id: v.id,
          totalVenta: v.totalVenta,
          tipoComprobante: v.tipoComprobante ?? null,
          metodoPago: v.metodoPago?.metodoPago ?? null,
          fechaVenta: v.fechaVenta,
          referenciaPago: v.referenciaPago ?? 'N/A',
          cliente: v.cliente
            ? { id: v.cliente.id, nombre: v.cliente.nombre }
            : 'CF',
          productos: v.productos.map((p) => ({
            id: p.id,
            cantidad: p.cantidad,
            precioVenta: p.precioVenta,
            estado: p.estado,
            producto: {
              id: p.producto.id,
              nombre: p.producto.nombre,
              descripcion: p.producto.descripcion,
              codigoProducto: p.producto.codigoProducto,
              imagenesProducto: p.producto.imagenesProducto.map(
                (img, index) => ({
                  id: index,
                  public_id: img.public_id,
                  url: img.url,
                }),
              ),
            },
          })),
        })),
      }));

      if ((pageOptions as any).groupBySucursal) {
        const agrupado = items.reduce<
          Record<
            number,
            {
              sucursal: { id: number; nombre: string };
              registros: typeof items;
            }
          >
        >((acc, it) => {
          const key = it.sucursal.id;
          if (!acc[key])
            acc[key] = { sucursal: it.sucursal, registros: [] as any };
          acc[key].registros.push(it);
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
      this.logger.error(`El error presentado es: ${error}`);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Error inesperado');
    }
  }

  /**
   *
   * @param id ID de caja
   * @returns La caja con todas sus props
   */
  async getRegistroCajaById(id: number) {
    try {
      const caja = await this.prisma.registroCaja.findUnique({
        where: { id },
        select: {
          id: true,
          creadoEn: true,
          actualizadoEn: true,
          comentario: true,
          comentarioFinal: true,
          depositado: true,
          estado: true,
          fechaApertura: true,
          fechaCierre: true,
          movimientoCaja: true,
          saldoInicial: true,
          saldoFinal: true,

          movimientos: {
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
              referencia: true,
              tipo: true,
              usadoParaCierre: true,
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
            },
          },

          sucursal: { select: { id: true, nombre: true } },

          usuarioInicio: {
            select: { id: true, nombre: true, correo: true },
          },
          usuarioCierre: {
            select: { id: true, nombre: true, correo: true },
          },

          venta: {
            orderBy: { fechaVenta: 'desc' },
            select: {
              id: true,
              totalVenta: true,
              fechaVenta: true,
              tipoComprobante: true,
              referenciaPago: true,
              metodoPago: { select: { metodoPago: true } },
              productos: {
                select: {
                  id: true,
                  cantidad: true,
                  precioVenta: true,
                  estado: true,
                  producto: {
                    select: {
                      id: true,
                      codigoProducto: true,
                      nombre: true,
                      descripcion: true,
                      imagenesProducto: {
                        select: { id: true, public_id: true, url: true },
                      },
                    },
                  },
                },
              },
              cliente: { select: { id: true, nombre: true } },
            },
          },
        },
      });

      if (!caja) throw new NotFoundException('Registro de caja no encontrado');

      // —— mapping idéntico al de la lista ——
      const item = {
        id: caja.id,
        creadoEn: caja.creadoEn,
        actualizadoEn: caja.actualizadoEn,
        comentarioInicial: caja.comentario ?? null,
        comentarioFinal: caja.comentarioFinal ?? null,
        depositado: caja.depositado,
        estado: caja.estado,
        fechaApertura: caja.fechaApertura,
        fechaCierre: caja.fechaCierre,
        movimientoCaja: caja.movimientoCaja,
        saldoInicial: caja.saldoInicial,
        saldoFinal: caja.saldoFinal,
        ventasLenght: caja.venta.length,
        movimientosLenght: caja.movimientos.length,

        usuarioInicio: caja.usuarioInicio
          ? {
              id: caja.usuarioInicio.id,
              nombre: caja.usuarioInicio.nombre,
              correo: caja.usuarioInicio.correo,
            }
          : null,

        usuarioCierre: caja.usuarioCierre
          ? {
              id: caja.usuarioCierre.id,
              nombre: caja.usuarioCierre.nombre,
              correo: caja.usuarioCierre.correo,
            }
          : null,

        sucursal: {
          id: caja.sucursal.id,
          nombre: caja.sucursal.nombre,
        },

        movimientosCaja: (caja.movimientos ?? []).map((m) => ({
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
          usadoParaCierre: m.usadoParaCierre,
          proveedor: m.proveedor
            ? { id: m.proveedor.id, nombre: m.proveedor.nombre }
            : null,
          usuario: m.usuario
            ? {
                id: m.usuario.id,
                nombre: m.usuario.nombre,
                rol: m.usuario.rol,
                correo: m.usuario.correo,
              }
            : null,
        })),

        ventas: (caja.venta ?? []).map((v) => ({
          id: v.id,
          totalVenta: v.totalVenta,
          tipoComprobante: v.tipoComprobante ?? null,
          metodoPago: v.metodoPago?.metodoPago ?? null,
          fechaVenta: v.fechaVenta,
          referenciaPago: v.referenciaPago ?? 'N/A',
          cliente: v.cliente
            ? { id: v.cliente.id, nombre: v.cliente.nombre }
            : 'CF',
          productos: v.productos.map((p) => ({
            id: p.id,
            cantidad: p.cantidad,
            precioVenta: p.precioVenta,
            estado: p.estado,
            producto: {
              id: p.producto.id,
              nombre: p.producto.nombre,
              descripcion: p.producto.descripcion,
              codigoProducto: p.producto.codigoProducto,
              imagenesProducto: p.producto.imagenesProducto.map(
                (img, index) => ({
                  id: index, // mismo criterio que usaste en la lista
                  public_id: img.public_id,
                  url: img.url,
                }),
              ),
            },
          })),
        })),
      };

      return item;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Error inesperado');
    }
  }
}
