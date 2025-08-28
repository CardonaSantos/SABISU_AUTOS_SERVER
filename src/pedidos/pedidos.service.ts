import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as dayjs from 'dayjs';
import 'dayjs/locale/es';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { TZGT } from 'src/utils/utils';
import { GetPedidosQueryDto } from './Querys/getPedidosQuery.dto';
import { Prisma } from '@prisma/client';
import { GetProductosToPedidosQuery } from './Querys/get-pedidos-query.dto';
import { UpdatePedidoDto } from './dto/update-pedidos.dto';
import { ReceivePedidoComprasDto } from './dto/sendPedidoToCompras';
import { text } from 'stream/consumers';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale('es');

type StockPorSucursal = {
  sucursalId: number;
  sucursalNombre: string;
  cantidad: number;
};

type ProductoFormatt = {
  id: number;
  nombre: string;
  codigoProducto: string;
  codigoProveedor: string;
  descripcion: string | null;
  stockPorSucursal: StockPorSucursal[];
};

@Injectable()
export class PedidosService {
  private readonly logger = new Logger(PedidosService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   *
   * @param dto Props para crear un pedido estandar
   * @returns
   */
  async createPedidoMain(dto: CreatePedidoDto) {
    try {
      const {
        clienteId,
        lineas,
        sucursalId,
        usuarioId,
        observaciones,
        prioridad,
        tipo,
      } = dto;

      if (!lineas?.length) {
        throw new BadRequestException('Debe incluir al menos una línea.');
      }

      return await this.prisma.$transaction(async (tx) => {
        const pedidoHead = await tx.pedido.create({
          data: {
            folio: '', // temporal: se actualiza luego con el ID
            estado: 'PENDIENTE',
            observaciones: observaciones ?? null,
            cliente: clienteId ? { connect: { id: clienteId } } : {},
            sucursal: { connect: { id: sucursalId } },
            usuario: { connect: { id: usuarioId } },
            prioridad: prioridad,
            tipo: tipo,
          },
          select: { id: true },
        });

        const productIds = Array.from(new Set(lineas.map((l) => l.productoId)));
        const productos = await tx.producto.findMany({
          where: { id: { in: productIds } },
          select: { id: true, precioCostoActual: true },
        });

        if (productos.length !== productIds.length) {
          const found = new Set(productos.map((p) => p.id));
          const missing = productIds.filter((id) => !found.has(id));
          throw new BadRequestException(
            `Productos no encontrados: ${missing.join(', ')}`,
          );
        }

        const priceByProduct = new Map(
          productos.map((p) => [p.id, p.precioCostoActual]),
        );

        const linesData = lineas.map((l) => {
          const pu = priceByProduct.get(l.productoId);
          if (pu == null) {
            throw new BadRequestException(
              `Producto ${l.productoId} no tiene precioCostoActual definido.`,
            );
          }
          const subtotal = pu * l.cantidad;
          return {
            pedidoId: pedidoHead.id,
            productoId: l.productoId,
            cantidad: l.cantidad,
            precioUnitario: pu,
            subtotal,
            notas: l.notas ?? null,
          };
        });

        await tx.pedidoLinea.createMany({ data: linesData });

        const totalLineas = linesData.length;
        const totalPedido = linesData.reduce((acc, it) => acc + it.subtotal, 0);
        const anio = dayjs().tz(TZGT).format('YYYY');
        const folio = `PED-${anio}-${String(pedidoHead.id).padStart(4, '0')}`; // ajusta formato si prefieres con espacios

        await tx.pedido.update({
          where: { id: pedidoHead.id },
          data: {
            folio,
            totalLineas,
            totalPedido,
          },
        });

        const created = await tx.pedido.findUnique({
          where: { id: pedidoHead.id },
          select: {
            id: true,
            folio: true,
            fecha: true,
            estado: true,
            observaciones: true,
            totalLineas: true,
            totalPedido: true,
            creadoEn: true,
            actualizadoEn: true,
            cliente: { select: { id: true, nombre: true } },
            sucursal: { select: { id: true, nombre: true } },
            usuario: { select: { id: true, nombre: true } },
            lineas: {
              select: {
                id: true,
                productoId: true,
                cantidad: true,
                precioUnitario: true,
                subtotal: true,
                notas: true,
                producto: {
                  select: {
                    id: true,
                    nombre: true,
                    codigoProducto: true,
                    precioCostoActual: true,
                    categorias: { select: { id: true, nombre: true } },
                  },
                },
              },
              orderBy: { id: 'asc' },
            },
          },
        });

        return created;
      });
    } catch (error) {
      this.logger.error('El error generado es: ', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Fatal error: Error inesperado');
    }
  }

  async sendPedidoToCompras(dto: ReceivePedidoComprasDto) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const { pedidoId, proveedorId, userID, sucursalId } = dto;
        console.log(
          'La data llegnado es: ',
          pedidoId,
          proveedorId,
          userID,
          sucursalId,
        );

        const existing = await tx.compra.findFirst({
          where: {
            pedido: {
              id: pedidoId,
            },
          },
          include: { detalles: true },
        });
        if (existing) {
          throw new BadRequestException(
            'El pedido ya tiene una compra asignada',
          );
        }

        const pedido = await tx.pedido.findUnique({
          where: {
            id: pedidoId,
          },
          select: {
            id: true,
            sucursalId: true,
            lineas: {
              select: {
                id: true,
                cantidad: true,
                precioUnitario: true,
                productoId: true,
                producto: true,
              },
            },
          },
        });

        if (!pedido) throw new NotFoundException('Pedido no encontrado');

        if (pedido.lineas.length <= 0)
          throw new InternalServerErrorException(
            'El pedido tiene lineas vacías',
          );

        const detallesToCompra = pedido.lineas.map((ln) => ({
          id: ln.id,
          cantidad: ln.cantidad,
          costoUnitario: ln.precioUnitario,
          productoId: ln.productoId,
        }));

        const compra = await tx.compra.create({
          data: {
            fecha: dayjs().tz(TZGT).toDate(),
            total: 0,
            usuario: {
              connect: {
                id: userID,
              },
            },
            sucursal: sucursalId
              ? {
                  connect: {
                    id: sucursalId,
                  },
                }
              : {
                  connect: {
                    id: pedido.sucursalId,
                  },
                },

            pedido: {
              connect: {
                id: pedido.id,
              },
            },
            proveedor: { connect: { id: proveedorId } },
          },
        });

        for (const linea of detallesToCompra) {
          await tx.compraDetalle.create({
            data: {
              cantidad: linea.cantidad,
              costoUnitario: linea.costoUnitario,
              producto: {
                connect: {
                  id: linea.productoId,
                },
              },
              compra: {
                connect: {
                  id: compra.id,
                },
              },
            },
          });
        }

        const detallesCompra = await tx.compraDetalle.findMany({
          where: {
            compraId: compra.id,
          },
          select: {
            costoUnitario: true,
            cantidad: true,
          },
        });

        const totalCompra = detallesCompra.reduce(
          (acc, prod) => acc + prod.cantidad * prod.costoUnitario,
          0,
        );

        //actualizar registro de compra
        await tx.compra.update({
          where: {
            id: compra.id,
          },
          data: {
            total: totalCompra,
            origen: 'PEDIDO',
          },
        });

        await tx.pedido.update({
          where: {
            id: pedido.id,
          },
          data: {
            estado: 'ENVIADO_COMPRAS',
          },
        });

        return tx.compra.findUnique({
          where: { id: compra.id },
          include: {
            detalles: { include: { producto: true, requisicionLinea: true } },
            proveedor: true,
            sucursal: true,
          },
        });
      });
    } catch (error) {
      this.logger.debug('El error generado es: ', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Fatal error: Error inesperado en enviar pedidos a compras',
      );
    }
  }

  async getPedidos(query: GetPedidosQueryDto) {
    try {
      const {
        page = 1,
        pageSize = 10,
        search,
        estado,
        sucursalId,
        clienteId,
        fechaFrom,
        fechaTo,
        sortBy,
        sortDir,
        productoId,
      } = query;

      const skip = (page - 1) * pageSize;
      const take = Number(pageSize);
      const sucursalIdNum = sucursalId ? Number(sucursalId) : undefined;
      const clienteIdNum = clienteId ? Number(clienteId) : undefined;
      const productoIdNum = productoId ? Number(productoId) : undefined;
      // ---------- WHERE (filtros + búsqueda) ----------
      const where: Prisma.PedidoWhereInput = {
        ...(estado ? { estado } : {}),
        ...(sucursalIdNum ? { sucursalId: sucursalIdNum } : {}),
        ...(clienteIdNum ? { clienteId: clienteIdNum } : {}),
        ...(fechaFrom || fechaTo
          ? {
              fecha: {
                ...(fechaFrom ? { gte: new Date(fechaFrom) } : {}),
                ...(fechaTo ? { lte: new Date(fechaTo) } : {}),
              },
            }
          : {}),
        ...(productoIdNum
          ? {
              lineas: {
                some: { productoId: productoIdNum },
              },
            }
          : {}),
        ...(search
          ? {
              OR: [
                { folio: { contains: search, mode: 'insensitive' } },
                { observaciones: { contains: search, mode: 'insensitive' } },
                {
                  cliente: {
                    nombre: { contains: search, mode: 'insensitive' },
                  },
                },
                {
                  sucursal: {
                    nombre: { contains: search, mode: 'insensitive' },
                  },
                },
                {
                  usuario: {
                    nombre: { contains: search, mode: 'insensitive' },
                  },
                },
                {
                  lineas: {
                    some: {
                      OR: [
                        {
                          producto: {
                            nombre: { contains: search, mode: 'insensitive' },
                          },
                        },
                        {
                          producto: {
                            codigoProducto: {
                              contains: search,
                              mode: 'insensitive',
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            }
          : {}),
      };

      // ---------- ORDER BY (seguro) ----------
      const dir: Prisma.SortOrder = sortDir === 'asc' ? 'asc' : 'desc';
      const orderBy: Prisma.PedidoOrderByWithRelationInput =
        sortBy === 'folio'
          ? { folio: dir }
          : sortBy === 'estado'
            ? { estado: dir }
            : sortBy === 'totalPedido'
              ? { totalPedido: dir }
              : sortBy === 'totalLineas'
                ? { totalLineas: dir }
                : sortBy === 'creadoEn'
                  ? { creadoEn: dir }
                  : sortBy === 'actualizadoEn'
                    ? { actualizadoEn: dir }
                    : sortBy === 'clienteNombre'
                      ? { cliente: { nombre: dir } }
                      : sortBy === 'sucursalNombre'
                        ? { sucursal: { nombre: dir } }
                        : // default
                          { fecha: 'desc' };

      // ---------- SELECT “definitivo” (pedido + líneas + producto) ----------
      const select = {
        id: true,
        folio: true,
        fecha: true,
        estado: true as const,
        observaciones: true,
        totalLineas: true,
        totalPedido: true,
        creadoEn: true,
        actualizadoEn: true,
        tipo: true,
        prioridad: true,

        // Cabeceras relacionadas (para table & quick-view)
        cliente: { select: { id: true, nombre: true } },
        sucursal: { select: { id: true, nombre: true } },
        usuario: { select: { id: true, nombre: true } },

        // Si enlazas contra compra:
        compra: { select: { id: true, estado: true } },

        // Contadores útiles
        _count: { select: { lineas: true } },

        // Líneas + producto (minimal “mejorcito”)
        lineas: {
          select: {
            id: true,
            pedidoId: true,
            productoId: true,
            cantidad: true,
            precioUnitario: true,
            subtotal: true,
            notas: true,
            creadoEn: true,
            actualizadoEn: true,
            producto: {
              select: {
                id: true,
                nombre: true,
                codigoProducto: true,
                precioCostoActual: true,
                categorias: {
                  select: { id: true, nombre: true },
                },
              },
            },
          },
          orderBy: { id: 'asc' }, // líneas ordenadas consistentemente
        },
      } satisfies Prisma.PedidoSelect;

      // ---------- Query + Count (transacción) ----------
      const [data, totalItems] = await this.prisma.$transaction([
        this.prisma.pedido.findMany({
          where,
          select,
          orderBy,
          skip,
          take,
        }),
        this.prisma.pedido.count({ where }),
      ]);

      const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

      // ---------- Normalización útil para la UI ----------
      // Asegura totalPedido (por si en algún registro está null)
      const normalized = data.map((p) => ({
        ...p,
        totalPedido:
          p.totalPedido ??
          p.lineas.reduce(
            (acc, ln) =>
              acc + (ln.subtotal ?? ln.cantidad * (ln.precioUnitario ?? 0)),
            0,
          ),
      }));

      return {
        data: normalized,
        page,
        pageSize,
        totalItems,
        totalPages,
        sortBy: sortBy ?? 'fecha',
        sortDir: sortDir ?? 'desc',
      };
    } catch (error) {
      this.logger?.error('getPedidos error', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Fatal error: Error inesperado');
    }
  }

  async getProductsToPedidos(query: GetProductosToPedidosQuery) {
    const {
      page = 1,
      pageSize = 10,
      nombre,
      codigoProducto,
      search,
      codigoProveedor,
    } = query;
    console.log(
      'Las props son: ',
      page,
      pageSize,
      nombre,
      codigoProducto,
      codigoProveedor,
      search,
    );

    const where: Prisma.ProductoWhereInput = search
      ? {
          OR: [
            { nombre: { contains: search, mode: 'insensitive' } },
            { codigoProducto: { contains: search, mode: 'insensitive' } },
            { codigoProveedor: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const skip = (page - 1) * pageSize;
    const take = Number(pageSize);

    const [products, totalItems] = await this.prisma.$transaction([
      this.prisma.producto.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          nombre: true,
          codigoProducto: true,
          codigoProveedor: true,
          descripcion: true,
          precioCostoActual: true,
          stock: {
            select: {
              cantidad: true,
              sucursal: { select: { id: true, nombre: true } },
            },
          },
        },
      }),
      this.prisma.producto.count({ where }),
    ]);

    const productosFormatt = products.map((p) => {
      const stockPorSucursal = p.stock.reduce<Record<number, StockPorSucursal>>(
        (acc, s) => {
          const suc = s.sucursal;
          if (!acc[suc.id]) {
            acc[suc.id] = {
              sucursalId: suc.id,
              sucursalNombre: suc.nombre,
              cantidad: 0,
            };
          }
          acc[suc.id].cantidad += s.cantidad;
          return acc;
        },
        {},
      );
      return {
        id: p.id,
        nombre: p.nombre,
        codigoProducto: p.codigoProducto,
        codigoProveedor: p.codigoProveedor,
        descripcion: p.descripcion,
        stockPorSucursal: Object.values(stockPorSucursal),
        precioCostoActual: p.precioCostoActual,
      };
    });

    const totalPages = Math.ceil(totalItems / pageSize);

    return {
      data: productosFormatt,
      page,
      pageSize,
      totalItems,
      totalPages,
    };
  }

  async deletePedidoRegist(pedidoID: number) {
    try {
      if (!pedidoID) {
        throw new BadRequestException('ID de pedido no valido');
      }

      const deleteRegist = await this.prisma.pedido.delete({
        where: {
          id: pedidoID,
        },
      });
      return deleteRegist;
    } catch (error) {
      this.logger.error('El error en delete pedido es: ', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Fatal error en delete registro pedido',
      );
    }
  }

  // ACTUALIZACION Y UPDATE
  async getPedidoById(id: number) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: {
        cliente: {
          select: { id: true, nombre: true, apellidos: true },
        },
        sucursal: {
          select: { id: true, nombre: true },
        },
        lineas: {
          include: {
            producto: {
              select: {
                id: true,
                nombre: true,
                codigoProducto: true,
                descripcion: true,
                precioCostoActual: true,
              },
            },
          },
        },
      },
    });

    if (!pedido) {
      throw new NotFoundException(`Pedido con id ${id} no encontrado`);
    }

    return pedido;
  }

  async updatePedido(id: number, dto: UpdatePedidoDto) {
    if (!dto.lineas?.length) {
      throw new BadRequestException('Debe incluir al menos una línea.');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Traemos precios de los productos
      const productIds = Array.from(
        new Set(dto.lineas.map((l) => l.productoId)),
      );
      const productos = await tx.producto.findMany({
        where: { id: { in: productIds } },
        select: { id: true, precioCostoActual: true },
      });

      if (productos.length !== productIds.length) {
        const found = new Set(productos.map((p) => p.id));
        const missing = productIds.filter((id) => !found.has(id));
        throw new BadRequestException(
          `Productos no encontrados: ${missing.join(', ')}`,
        );
      }

      const priceByProduct = new Map(
        productos.map((p) => [p.id, p.precioCostoActual]),
      );

      // 2. Armar líneas recalculando totales
      const linesData = dto.lineas.map((l) => {
        const pu = priceByProduct.get(l.productoId);
        if (pu == null) {
          throw new BadRequestException(
            `Producto ${l.productoId} no tiene precioCostoActual definido.`,
          );
        }
        const subtotal = pu * l.cantidad;
        return {
          productoId: l.productoId,
          cantidad: l.cantidad,
          precioUnitario: pu,
          subtotal,
          notas: l.notas ?? null,
        };
      });

      // 3. Borrar líneas anteriores y recrear
      await tx.pedidoLinea.deleteMany({ where: { pedidoId: id } });
      await tx.pedidoLinea.createMany({
        data: linesData.map((l) => ({
          pedidoId: id,
          ...l,
        })),
      });

      const totalLineas = linesData.length;
      const totalPedido = linesData.reduce((acc, it) => acc + it.subtotal, 0);

      // 4. Actualizar cabecera
      await tx.pedido.update({
        where: { id },
        data: {
          sucursalId: dto.sucursalId,
          clienteId: dto.clienteId,
          prioridad: dto.prioridad,
          tipo: dto.tipo,
          observaciones: dto.observaciones ?? null,
          totalLineas,
          totalPedido,
        },
      });

      // 5. Retornar pedido completo actualizado
      return tx.pedido.findUnique({
        where: { id },
        select: {
          id: true,
          folio: true,
          fecha: true,
          estado: true,
          observaciones: true,
          totalLineas: true,
          totalPedido: true,
          cliente: { select: { id: true, nombre: true } },
          sucursal: { select: { id: true, nombre: true } },
          usuario: { select: { id: true, nombre: true } },
          lineas: {
            select: {
              id: true,
              productoId: true,
              cantidad: true,
              precioUnitario: true,
              subtotal: true,
              notas: true,
              producto: {
                select: {
                  id: true,
                  nombre: true,
                  codigoProducto: true,
                  precioCostoActual: true,
                },
              },
            },
            orderBy: { id: 'asc' },
          },
        },
      });
    });
  }

  // VER UN PEDIDO
  async getPedidoByIdToShow(id: number) {
    try {
      const pedido = await this.prisma.pedido.findUnique({
        where: { id },
        select: {
          id: true,
          folio: true,
          fecha: true,
          estado: true,
          tipo: true,
          prioridad: true,
          observaciones: true,
          totalLineas: true,
          totalPedido: true,
          creadoEn: true,
          actualizadoEn: true,

          cliente: {
            select: {
              id: true,
              nombre: true,
              apellidos: true,
              telefono: true,
              direccion: true,
              observaciones: true,
            },
          },
          sucursal: { select: { id: true, nombre: true } },
          usuario: { select: { id: true, nombre: true, correo: true } },

          lineas: {
            select: {
              id: true,
              pedidoId: true,
              productoId: true,
              cantidad: true,
              precioUnitario: true,
              subtotal: true,
              notas: true,
              creadoEn: true,
              actualizadoEn: true,
              producto: {
                select: {
                  id: true,
                  nombre: true,
                  codigoProducto: true,
                  codigoProveedor: true,
                  descripcion: true,
                  precioCostoActual: true,
                  categorias: { select: { id: true, nombre: true } },
                  imagenesProducto: {
                    take: 1,
                    select: { url: true },
                  },
                },
              },
            },
            orderBy: { id: 'asc' },
          },
        },
      });

      if (!pedido) {
        throw new NotFoundException(`Pedido con id ${id} no encontrado`);
      }

      // Normalizar totales
      const totalPedido =
        pedido.totalPedido ??
        pedido.lineas.reduce(
          (acc, ln) =>
            acc + (ln.subtotal ?? ln.cantidad * (ln.precioUnitario ?? 0)),
          0,
        );

      return {
        ...pedido,
        totalPedido,
        lineas: pedido.lineas.map((l) => ({
          ...l,
          producto: {
            ...l.producto,
            imagenUrl: l.producto.imagenesProducto?.[0]?.url ?? null,
          },
        })),
      };
    } catch (error) {
      this.logger?.error('getPedidoById error', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Fatal error: Error inesperado');
    }
  }
}
