import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
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
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale('es');

@Injectable()
export class PedidosService {
  private readonly logger = new Logger(PedidosService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createPedidoMain(dto: CreatePedidoDto) {
    try {
      const { clienteId, lineas, sucursalId, usuarioId, observaciones } = dto;

      if (!lineas?.length) {
        throw new BadRequestException('Debe incluir al menos una línea.');
      }

      return await this.prisma.$transaction(async (tx) => {
        const pedidoHead = await tx.pedido.create({
          data: {
            folio: '', // temporal: se actualiza luego con el ID
            estado: 'PENDIENTE',
            observaciones: observaciones ?? null,
            cliente: { connect: { id: clienteId } },
            sucursal: { connect: { id: sucursalId } },
            usuario: { connect: { id: usuarioId } },
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

      // ---------- WHERE (filtros + búsqueda) ----------
      const where: Prisma.PedidoWhereInput = {
        ...(estado ? { estado } : {}),
        ...(sucursalId ? { sucursalId } : {}),
        ...(clienteId ? { clienteId } : {}),
        ...(fechaFrom || fechaTo
          ? {
              fecha: {
                ...(fechaFrom ? { gte: new Date(fechaFrom) } : {}),
                ...(fechaTo ? { lte: new Date(fechaTo) } : {}),
              },
            }
          : {}),
        ...(productoId
          ? {
              lineas: {
                some: { productoId },
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
                // Búsqueda también en líneas → producto
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
}
