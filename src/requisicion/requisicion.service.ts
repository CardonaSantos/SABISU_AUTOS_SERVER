import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateRequisicionDto } from './dto/create-requisicion.dto';
import { UpdateRequisicionDto } from './dto/update-requisicion.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateRequisitionDto,
  RequisitionResponse,
  StockAlertItem,
} from './utils';
import { UpdateRequisitionDto } from './dto/update-requisiciones.dto';

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
export class RequisicionService {
  private readonly logger = new Logger(RequisicionService.name);
  constructor(private readonly prisma: PrismaService) {}

  async getStockAlerts(sucursalId: number): Promise<StockAlertItem[]> {
    // 1) Trae thresholds + producto
    const thresholds = await this.prisma.stockThreshold.findMany({
      include: {
        producto: {
          select: {
            id: true,
            nombre: true,
            codigoProducto: true,
            precioCostoActual: true,
          },
        },
      },
    });

    const productoIds = thresholds.map((t) => t.productoId);

    // 2) Busca todas las líneas de requisición “pendientes” para esos productos
    const pendientes = await this.prisma.requisicionLinea.findMany({
      where: {
        productoId: { in: productoIds },
        ingresadaAStock: false, // aún no entra al stock
        requisicion: { estado: 'PENDIENTE' },
      },
      select: {
        productoId: true,
        requisicion: { select: { folio: true } },
      },
    });

    // 3) Agrupa los folios por productoId
    const mapaPendientes = pendientes.reduce((m, linea) => {
      const arr = m.get(linea.productoId) ?? [];
      arr.push(linea.requisicion.folio);
      m.set(linea.productoId, arr);
      return m;
    }, new Map<number, string[]>());

    const alerts: StockAlertItem[] = [];

    // 4) Itera thresholds y arma el StockAlertItem
    for (const t of thresholds) {
      // calcula stockActual
      const { _sum } = await this.prisma.stock.aggregate({
        where: { productoId: t.productoId, sucursalId },
        _sum: { cantidad: true },
      });
      const stockActual = _sum.cantidad ?? 0;

      if (stockActual <= t.stockMinimo) {
        const faltante = Math.max(t.stockMinimo - stockActual, 1);

        const folios = mapaPendientes.get(t.productoId) ?? [];

        alerts.push({
          productoId: t.productoId,
          nombre: t.producto.nombre,
          codigoProducto: t.producto.codigoProducto,
          id: t.producto.id,
          stockActual,
          stockMinimo: t.stockMinimo,
          cantidadSugerida: faltante,
          precioCosto: t.producto.precioCostoActual ?? 0,
          // nuevos campos:
          tieneSolicitudPendiente: folios.length > 0,
          foliosPendientes: folios,
        });
      }
    }

    return alerts;
  }

  async getRequisicionForEdit(id: number): Promise<StockAlertItem[]> {
    const requisicionToEdit = await this.prisma.requisicion.findUnique({
      where: { id },
      select: {
        id: true,
        createdAt: true,
        lineas: {
          select: {
            fechaExpiracion: true,
            cantidadSugerida: true,
            producto: {
              select: {
                id: true,
                nombre: true,
                codigoProducto: true,
                precioCostoActual: true,
                stock: {
                  select: {
                    cantidad: true,
                  },
                },
                stockThreshold: {
                  select: {
                    stockMinimo: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!requisicionToEdit) return [];

    // Formatea el array como StockAlertItem[]
    const items: StockAlertItem[] = requisicionToEdit.lineas.map((linea) => {
      const producto = linea.producto;
      const stockActual = producto.stock?.reduce(
        (acc, item) => acc + item.cantidad,
        0,
      );

      const stockMinimo = producto.stockThreshold?.stockMinimo ?? 0;

      return {
        productoId: producto.id,
        nombre: producto.nombre,
        codigoProducto: producto.codigoProducto,
        id: producto.id,
        precioCosto: producto.precioCostoActual,
        stockActual,
        stockMinimo,
        cantidadSugerida: linea.cantidadSugerida, // Puedes permitir editar este campo
        fechaExpiracion: linea.fechaExpiracion,
      };
    });

    return items;
  }

  /* ---------- Paso C ---------- */
  async createWithLines(
    dto: CreateRequisitionDto,
  ): Promise<RequisitionResponse> {
    if (!dto.lineas.length) {
      throw new HttpException(
        { code: 'SIN_LINEAS', message: 'No se incluyeron productos' },
        HttpStatus.BAD_REQUEST,
      );
    }

    // 1. Construir líneas y total
    const lineasCreate = await Promise.all(
      dto.lineas.map(
        async ({ productoId, cantidadSugerida, fechaExpiracion }) => {
          const threshold = await this.prisma.stockThreshold.findFirst({
            where: { productoId },
            include: {
              producto: {
                select: {
                  nombre: true,
                  codigoProducto: true,
                  precioCostoActual: true,
                },
              },
            },
          });

          if (!threshold) {
            throw new HttpException(
              { code: 'UMBRAL_NO_ENCONTRADO', productoId },
              HttpStatus.BAD_REQUEST,
            );
          }

          const { _sum } = await this.prisma.stock.aggregate({
            where: { productoId, sucursalId: dto.sucursalId },
            _sum: { cantidad: true },
          });

          const fechaExp = fechaExpiracion
            ? dayjs(fechaExpiracion)
                .tz('America/Guatemala')
                .startOf('day')
                .toDate()
            : null;

          return {
            productoId,
            cantidadActual: _sum.cantidad ?? 0,
            stockMinimo: threshold.stockMinimo,
            cantidadSugerida,
            precioUnitario: threshold.producto.precioCostoActual,
            fechaExpiracion: fechaExp, // <-- aquí la metes
          };
        },
      ),
    );

    const totalRequisicion = lineasCreate.reduce(
      (acc, l) => acc + l.precioUnitario * l.cantidadSugerida,
      0,
    );

    const year = new Date().getFullYear();

    // 2. Transacción atómica
    const requisicion = await this.prisma.$transaction(async (tx) => {
      const cabecera = await tx.requisicion.create({
        data: {
          folio: '', // placeholder
          sucursalId: dto.sucursalId,
          usuarioId: dto.usuarioId,
          observaciones: dto.observaciones,
          totalLineas: lineasCreate.length,
          totalRequisicion,
        },
      });

      // 2.2 Generar folio único a partir del ID
      const folio = `REQ-${year}-${String(cabecera.id).padStart(4, '0')}`;
      // 2.3 Crear líneas UNA POR UNA (guardar los IDs)
      const nuevasLineas = [];
      for (const l of lineasCreate) {
        const nuevaLinea = await tx.requisicionLinea.create({
          data: {
            ...l,
            requisicionId: cabecera.id,
          },
        });
        nuevasLineas.push(nuevaLinea);
      }

      // 2.4 Actualizar folio y retornar cabecera con líneas
      const completa = await tx.requisicion.update({
        where: { id: cabecera.id },
        data: {
          folio,
        },
        include: { lineas: true, sucursal: true, usuario: true },
      });

      // Opcional: Si necesitas devolver los IDs de las líneas, los tienes en nuevasLineas
      return completa;
    });

    // 3. Adaptar salida
    this.logger.debug('El registro es: ', requisicion);
    return {
      ...requisicion,
      fecha: requisicion.fecha.toISOString(),
      estado: 'PENDIENTE',
    };
  }

  create(createRequisicionDto: CreateRequisicionDto) {
    return 'This action adds a new requisicion';
  }

  async findAll() {
    try {
      const requisiciones = await this.prisma.requisicion.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              rol: true,
            },
          },
          lineas: {
            select: {
              id: true,
              cantidadActual: true,
              cantidadSugerida: true,
              fechaExpiracion: true,
              createdAt: true,
              precioUnitario: true,
              stockMinimo: true,
              updatedAt: true,
              ingresadaAStock: true,
              producto: {
                select: {
                  id: true,
                  codigoProducto: true,
                  nombre: true,
                  precioCostoActual: true,
                },
              },
            },
          },
          sucursal: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      });
      return requisiciones;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getRequisicionesFull() {
    try {
      const requisiciones = await this.prisma.requisicion.findMany({
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              rol: true,
            },
          },
          lineas: {
            select: {
              id: true,
              cantidadActual: true,
              cantidadSugerida: true,
              createdAt: true,
              precioUnitario: true,
              stockMinimo: true,
              updatedAt: true,
              producto: {
                select: {
                  id: true,
                  codigoProducto: true,
                  nombre: true,
                },
              },
            },
          },
          sucursal: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      });
      return requisiciones;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  /**
   *
   * @param id ID del registro de requisicion para retornar informacion y generar un PDF
   * @returns informacion de registro requisicion mediante su flujo de trabajo (finalizado o no)
   */
  async findOne(id: number) {
    try {
      const requisiciones = await this.prisma.requisicion.findUnique({
        where: {
          id,
        },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              rol: true,
            },
          },
          lineas: {
            select: {
              id: true,
              cantidadActual: true,
              cantidadSugerida: true,
              cantidadRecibida: true,
              createdAt: true,
              precioUnitario: true,
              stockMinimo: true,
              updatedAt: true,
              fechaExpiracion: true,

              producto: {
                select: {
                  id: true,
                  codigoProducto: true,
                  nombre: true,
                },
              },
            },
          },
          sucursal: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      });

      console.log('Los registros son: ', requisiciones);

      return requisiciones;
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException({
        message: 'Fatal error: Error inesperado XD',
      });
    }
  }

  update(id: number, updateRequisicionDto: UpdateRequisicionDto) {
    return `This action updates a #${id} requisicion`;
  }

  async remove(id: number) {
    try {
      console.log('Entrando al remove de requisiciones');

      if (!id) {
        throw new NotFoundException(
          'Error al encontrar registro de requisicion',
        );
      }

      const requisicionToDelete = await this.prisma.requisicion.delete({
        where: {
          id,
        },
      });
      return requisicionToDelete;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async generateRequsicionStock(id: number) {
    console.log();
  }

  async updateRequisitionWithLines(dto: UpdateRequisitionDto) {
    const { requisicionId, sucursalId, usuarioId, lineas } = dto;

    if (!lineas.length) {
      throw new BadRequestException(
        'No se incluyeron líneas para la requisición',
      );
    }

    // Verificar que exista la requisición
    const requisicion = await this.prisma.requisicion.findUnique({
      where: { id: requisicionId },
      include: { lineas: true },
    });
    if (!requisicion) throw new NotFoundException('Requisición no encontrada');

    // Armar nuevas líneas con precios actuales
    const nuevasLineas = await Promise.all(
      lineas.map(async ({ productoId, cantidadSugerida, fechaExpiracion }) => {
        const threshold = await this.prisma.stockThreshold.findFirst({
          where: { productoId },
          include: {
            producto: { select: { precioCostoActual: true } },
          },
        });
        if (!threshold) {
          throw new BadRequestException(
            `No hay umbral para producto ${productoId}`,
          );
        }

        return {
          productoId,
          cantidadSugerida,
          precioUnitario: threshold.producto.precioCostoActual,
          stockMinimo: threshold.stockMinimo,
          fechaExpiracion,
        };
      }),
    );

    const totalRequisicion = nuevasLineas.reduce(
      (acc, l) => acc + l.precioUnitario * l.cantidadSugerida,
      0,
    );

    const actualizada = await this.prisma.$transaction(async (tx) => {
      // 1. Borra líneas viejas
      await tx.requisicionLinea.deleteMany({
        where: { requisicionId },
      });

      // 2. Crea nuevas líneas una por una y guarda sus IDs
      const nuevasLineasIds: number[] = [];
      for (const l of nuevasLineas) {
        const { _sum } = await tx.stock.aggregate({
          where: { productoId: l.productoId, sucursalId },
          _sum: { cantidad: true },
        });

        const fechaExp = l.fechaExpiracion
          ? dayjs(l.fechaExpiracion)
              .tz('America/Guatemala')
              .startOf('day')
              .toDate()
          : null;

        await tx.requisicionLinea.create({
          data: {
            ...l,
            requisicionId,
            cantidadActual: _sum.cantidad ?? 0,
            fechaExpiracion: fechaExp,
          },
        });
      }

      const requisicionActualizada = await tx.requisicion.update({
        where: { id: requisicionId },
        data: {
          sucursalId,
          usuarioId,
          totalLineas: nuevasLineas.length,
          totalRequisicion,
        },
        include: { lineas: true, sucursal: true, usuario: true },
      });

      return requisicionActualizada;
    });

    return {
      ...actualizada,
      fecha: actualizada.fecha?.toISOString(),
      estado: 'PENDIENTE',
    };
  }
}
