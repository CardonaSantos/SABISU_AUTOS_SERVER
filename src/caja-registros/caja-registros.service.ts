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
import { PageOptionsDto } from './dto/page-options';
import { TimeoutError } from 'rxjs';

@Injectable()
export class CajaRegistrosService {
  private logger = new Logger(CajaRegistrosService.name);
  constructor(private readonly prisma: PrismaService) {}
  create(createCajaRegistroDto: CreateCajaRegistroDto) {
    return 'This action adds a new cajaRegistro';
  }

  async getRegistrosCajas(
    pageOptionsDTO: PageOptionsDto & { groupBySucursal?: boolean },
  ) {
    console.log('Las options son: ', pageOptionsDTO);

    try {
      const page = Number(pageOptionsDTO.page ?? 1);
      const limit = Number(pageOptionsDTO.limit ?? 10);
      const skip = (page - 1) * limit;

      const where = pageOptionsDTO.sucursalId
        ? { sucursalId: Number(pageOptionsDTO.sucursalId) }
        : undefined;

      const [total, cajas] = await this.prisma.$transaction([
        this.prisma.registroCaja.count(),
        this.prisma.registroCaja.findMany({
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
          : null, // <-- evita crash cuando la caja sigue abierta

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
          metodoPago: v.metodoPago?.metodoPago ?? null, // <- opcional seguro
          fechaVenta: v.fechaVenta,
          referenciaPago: v.referenciaPago ?? 'N/A', // <- tu comportamiento deseado
          cliente: v.cliente
            ? { id: v.cliente.id, nombre: v.cliente.nombre }
            : 'CF',
          productos: v.productos.map((v) => ({
            id: v.id,
            cantidad: v.cantidad,
            precioVenta: v.precioVenta,
            estado: v.estado,
            producto: {
              id: v.producto.id,
              nombre: v.producto.nombre,
              descripcion: v.producto.descripcion,
              codigoProducto: v.producto.codigoProducto,
              imagenesProducto: v.producto.imagenesProducto.map(
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

      // agrupado opcional por sucursal (si lo pides en query ?groupBySucursal=true)
      if ((pageOptionsDTO as any).groupBySucursal) {
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

  findAll() {
    return `This action returns all cajaRegistros`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cajaRegistro`;
  }

  update(id: number, updateCajaRegistroDto: UpdateCajaRegistroDto) {
    return `This action updates a #${id} cajaRegistro`;
  }

  remove(id: number) {
    return `This action removes a #${id} cajaRegistro`;
  }
}
