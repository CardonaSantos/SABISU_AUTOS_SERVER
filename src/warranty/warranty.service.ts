import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateWarrantyDto } from './dto/create-warranty.dto';
import { UpdateWarrantyDto } from './dto/update-warranty.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegistroGarantiaDto } from './dto/create-regist-warranty.dto';

import * as dayjs from 'dayjs';
import 'dayjs/locale/es';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { HistorialStockTrackerService } from 'src/historial-stock-tracker/historial-stock-tracker.service';
import {
  EstadoDetalleVenta,
  EstadoGarantia,
  TipoMovimientoStock,
} from '@prisma/client';
import { GarantiaDto } from './interfaces';
import { createNewTimeLimeDTO } from './dto-timeline/timelineCreateDTO.dto';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale('es');
const estadosQueCierran = [
  EstadoGarantia.REPARADO,
  EstadoGarantia.REEMPLAZADO,
  EstadoGarantia.RECHAZADO_CLIENTE,
  EstadoGarantia.CANCELADO,
];

@Injectable()
export class WarrantyService {
  private readonly logger = new Logger(WarrantyService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly tracker: HistorialStockTrackerService,
  ) {}
  //CREAR REGISTRO INICIAL, TRACKEAR MOVIMIENTO, RECUPERAR STOCK
  async create(createWarrantyDto: CreateWarrantyDto) {
    const {
      ventaId,
      productoId,
      sucursalId,
      usuarioIdRecibe,
      clienteId,
      cantidadDevuelta,
      descripcionProblema,
      comentario,
    } = createWarrantyDto;

    if (!clienteId || !productoId || !ventaId || !usuarioIdRecibe) {
      throw new BadRequestException(
        'Faltan datos necesarios para crear la garantía',
      );
    }

    // 1. Transacción atómica
    const garantiaConRegistros = await this.prisma.$transaction(async (tx) => {
      // 2. Crear garantía
      const garantia = await tx.garantia.create({
        data: {
          venta: { connect: { id: ventaId } },
          producto: { connect: { id: productoId } },
          cliente: { connect: { id: clienteId } },
          sucursal: sucursalId ? { connect: { id: sucursalId } } : undefined,
          usuarioRecibe: { connect: { id: usuarioIdRecibe } },
          cantidadDevuelta,
          descripcionProblema,
          comentario,
          estado: EstadoGarantia.RECIBIDO,
          fechaRecepcion: dayjs().tz('America/Guatemala').toDate(),
        },
      });

      // 3. Ajustar inventario (sumar devolución)
      const lote = await tx.stock.findFirst({
        where: { productoId, sucursalId },
        orderBy: { fechaIngreso: 'desc' },
      });
      if (!lote) {
        throw new BadRequestException(
          `No hay lote de stock para producto ${productoId} en sucursal ${sucursalId}`,
        );
      }
      await tx.stock.update({
        where: { id: lote.id },
        data: { cantidad: { increment: cantidadDevuelta } },
      });
      // (Opcional: tracker)
      await this.tracker.trackerGarantia(
        tx,
        productoId,
        sucursalId,
        usuarioIdRecibe,
        garantia.id,
        TipoMovimientoStock.GARANTIA,
        'Ingreso por garantía',
        lote.cantidad,
        cantidadDevuelta,
      );

      // 4. Ajustar venta
      const ventaProd = await tx.ventaProducto.findFirst({
        where: { ventaId, productoId },
      });
      if (!ventaProd) {
        throw new BadRequestException(
          `El ítem de venta no existe para venta ${ventaId} / producto ${productoId}`,
        );
      }
      await tx.ventaProducto.update({
        where: { id: ventaProd.id },
        data: {
          cantidad: ventaProd.cantidad - cantidadDevuelta,
          estado: 'PARCIAL_GARANTIA',
        },
      });

      // Recalcular total de la venta
      const items = await tx.ventaProducto.findMany({ where: { ventaId } });
      const nuevoTotal = items.reduce(
        (sum, i) => sum + i.cantidad * i.precioVenta,
        0,
      );
      await tx.venta.update({
        where: { id: ventaId },
        data: {
          totalVenta: {
            decrement: nuevoTotal,
          },
        },
      });

      // 5. Crear registro de timeline inicial
      await tx.registroGarantia.create({
        data: {
          garantia: { connect: { id: garantia.id } },
          usuario: { connect: { id: usuarioIdRecibe } },
          estado: EstadoGarantia.RECIBIDO,
          accionesRealizadas: 'Ingreso al inventario por garantía',
          fechaRegistro: dayjs().tz('America/Guatemala').toDate(),
        },
      });

      // 6. Recuperar la garantía con sus registros para devolverla
      return tx.garantia.findUnique({
        where: { id: garantia.id },
        include: { registros: true },
      });
    });

    return garantiaConRegistros!;
  }

  async createNewTimeLime(dto: createNewTimeLimeDTO) {
    try {
      this.logger.log('La data llegando es: ', dto);
      const { conclusion, accionesRealizadas, estado, garantiaID, userID } =
        dto;

      if (
        [conclusion, accionesRealizadas, estado, garantiaID, userID].some(
          (p) => p == null,
        )
      ) {
        throw new BadRequestException('PROP INDEFINIDA');
      }

      return await this.prisma.$transaction(async (tx) => {
        // 1) Crear registro de timeline
        const newTimeLine = await tx.registroGarantia.create({
          data: {
            garantia: { connect: { id: garantiaID } },
            usuario: { connect: { id: userID } },
            estado,
            accionesRealizadas,
            conclusion,
          },
        });

        // 2) Actualizar estado principal de la garantía
        const garantiaMain = await tx.garantia.update({
          where: { id: garantiaID },
          data: { estado: estado },
        });

        // Si se va a cerrar, chequeamos el estado previo
        if (estado === EstadoGarantia.CERRADO) {
          const estadosQueCierran: EstadoGarantia[] = [
            EstadoGarantia.REPARADO,
            EstadoGarantia.REEMPLAZADO,
            EstadoGarantia.RECHAZADO_CLIENTE,
            EstadoGarantia.CANCELADO,
          ];
          const regs = await tx.registroGarantia.findMany({
            where: { garantiaId: garantiaID },
            orderBy: { fechaRegistro: 'asc' },
            select: { estado: true },
          });
          const previo = regs[regs.length - 2]?.estado;
          if (!estadosQueCierran.includes(previo)) {
            throw new BadRequestException(
              `Sólo se puede cerrar desde: ${estadosQueCierran.join(', ')}`,
            );
          }

          // --- NUEVOS CASOS ---
          switch (previo) {
            case EstadoGarantia.REPARADO:
            case EstadoGarantia.REEMPLAZADO:
            case EstadoGarantia.CANCELADO:
              this.logger.log(
                `${previo} → revirtiendo garantía: saco del stock y restauro la venta`,
              );
              // 1) Sacar del inventario la unidad que entró por garantía
              const loteARetirar = await tx.stock.findFirst({
                where: {
                  productoId: garantiaMain.productoId,
                  sucursalId: garantiaMain.sucursalId,
                },
                orderBy: { fechaIngreso: 'desc' },
              });
              if (!loteARetirar) {
                throw new BadRequestException(
                  `No hay stock para retirar la garantía ${garantiaID}`,
                );
              }
              await tx.stock.update({
                where: { id: loteARetirar.id },
                data: {
                  cantidad: { decrement: garantiaMain.cantidadDevuelta },
                },
              });

              // 2) Restaurar la venta
              const ventaARestaurar = await tx.ventaProducto.findFirst({
                where: {
                  ventaId: garantiaMain.ventaId,
                  productoId: garantiaMain.productoId,
                },
              });
              if (!ventaARestaurar) {
                throw new BadRequestException(
                  'No se encontró el ítem de venta a ajustar',
                );
              }
              await tx.ventaProducto.update({
                where: { id: ventaARestaurar.id },
                data: {
                  cantidad: { increment: garantiaMain.cantidadDevuelta },
                  estado: 'VENDIDO',
                },
              });

              // 3) Recalcular total
              const itemsRestaurados = await tx.ventaProducto.findMany({
                where: { ventaId: garantiaMain.ventaId },
              });
              const totalRestaurado = itemsRestaurados.reduce(
                (sum, i) => sum + i.cantidad * i.precioVenta,
                0,
              );
              await tx.venta.update({
                where: { id: garantiaMain.ventaId },
                data: { totalVenta: totalRestaurado },
              });
              break;

            case EstadoGarantia.RECHAZADO_CLIENTE:
              this.logger.log(
                'RECHAZADO_CLIENTE → no se toca nada: el cliente se queda con el producto defectuoso',
              );
              break;
          }
        }

        this.logger.log('El nuevo registro de timeline es: ', newTimeLine);
        return newTimeLine;
      });
    } catch (error) {
      this.logger.error('El error es: ', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException({
        message: 'Fatal Error: Error inesperado creando registro timeline',
      });
    }
  }

  //CREAR REGISTRO FINAL DE GARANTÍA
  async createRegistWarranty(creatreRegistWarranty: RegistroGarantiaDto) {}

  async getAllRegistWarranty() {
    try {
      const registrosGarantias = await this.prisma.garantia.findMany({
        include: {
          cliente: true,
          producto: true,
          // proveedor: true,
          // registros: true,
          // usuarioRecibe: true,
          // venta: true,
          movimientoStock: true,
        },
      });
      console.log('Los registros son: ', registrosGarantias.length);
      return registrosGarantias;
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error('El error registrado: ', error);
      throw new InternalServerErrorException({
        message: 'Fatal Error: Error inesperado',
      });
    }
  }

  async findAll() {
    try {
      const warranties = await this.prisma.garantia.findMany({
        where: {
          estado: {
            notIn: ['CERRADO'],
          },
        },
        include: {
          cliente: {
            select: {
              id: true,
              nombre: true,
              telefono: true,
              direccion: true,
              dpi: true,
            },
          },
          proveedor: {
            select: {
              id: true,
              nombre: true,
              telefono: true,
              telefonoContacto: true,
            },
          },
          usuarioRecibe: {
            select: {
              id: true,
              nombre: true,
              rol: true,
              sucursal: {
                select: {
                  id: true,
                  nombre: true,
                },
              },
            },
          },
          producto: {
            select: {
              id: true,
              nombre: true,
              descripcion: true,
              codigoProducto: true,
            },
          },
        },
        orderBy: {
          creadoEn: 'desc',
        },
      });

      return warranties;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al conseguir farantías');
    }
  }

  async findOne(id: number) {
    try {
      const warranties = await this.prisma.garantia.findMany({
        where: {
          id,
        },
        include: {
          cliente: {
            select: {
              id: true,
              nombre: true,
              telefono: true,
              direccion: true,
              dpi: true,
            },
          },
          usuarioRecibe: {
            select: {
              id: true,
              nombre: true,
              rol: true,
              sucursal: {
                select: {
                  id: true,
                  nombre: true,
                  direccion: true,
                },
              },
            },
          },
          producto: {
            select: {
              id: true,
              nombre: true,
              descripcion: true,
              codigoProducto: true,
            },
          },
        },
        orderBy: {
          creadoEn: 'desc',
        },
      });

      return warranties;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al conseguir farantías');
    }
  }

  async update(id: number, updateWarrantyDto: UpdateWarrantyDto) {
    try {
      console.log('Los datos llegando al update warranty');
      console.log('La data es: ', updateWarrantyDto);

      if (!id) {
        throw new BadRequestException({
          message: 'ID no proporcionado',
        });
      }

      const { comentario, estado, descripcionProblema } = updateWarrantyDto;

      const registToUpdate = await this.prisma.garantia.update({
        where: {
          id,
        },
        data: {
          comentario: comentario,
          descripcionProblema: descripcionProblema,
          estado: estado,
        },
      });

      console.log(registToUpdate);

      return registToUpdate;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al actualizar');
    }
  }

  async getOneWarrantyFinalForPdf(id: number) {
    // try {
    //   const registsWarranties = await this.prisma.registroGarantia.findUnique({
    //     where: {
    //       id,
    //     },
    //     include: {
    //       producto: {
    //         select: {
    //           id: true,
    //           nombre: true,
    //           descripcion: true,
    //           codigoProducto: true,
    //         },
    //       },
    //       usuario: {
    //         select: {
    //           id: true,
    //           nombre: true,
    //           sucursal: {
    //             select: {
    //               id: true,
    //               nombre: true,
    //               direccion: true,
    //             },
    //           },
    //         },
    //       },
    //       garantia: {
    //         //INFORMACION DE CUANDO SE RECIBIÓ LA GARANTÍA
    //         select: {
    //           id: true,
    //           fechaRecepcion: true,
    //           estado: true,
    //           cliente: {
    //             select: {
    //               id: true,
    //               nombre: true,
    //               telefono: true,
    //               direccion: true,
    //               dpi: true,
    //             },
    //           },
    //         },
    //       },
    //     },
    //   });
    //   return registsWarranties;
    // } catch (error) {
    //   console.error('Error al obtener registros de garantía:', error);
    //   throw new Error('Error al obtener registros de garantía.');
    // }
  }

  remove(id: number) {
    return `This action removes a #${id} warranty`;
  }

  async removeAll() {
    try {
      const warranties = await this.prisma.garantia.deleteMany({});
      return warranties;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al eliminar las garantías');
    }
  }

  /**
   *
   * @returns array de garantias no cerradas
   */
  async getGarantiasNotClosed(): Promise<GarantiaDto[]> {
    const raw = await this.prisma.garantia.findMany({
      where: {
        estado: {
          not: 'CERRADO',
        },
      },
      include: {
        venta: { select: { id: true, fechaVenta: true } },
        cliente: { select: { id: true, nombre: true } },
        producto: {
          select: {
            id: true,
            nombre: true,
            codigoProducto: true,
            descripcion: true,
          },
        },
        proveedor: { select: { id: true, nombre: true } },
        usuarioRecibe: { select: { id: true, nombre: true } },
        registros: {
          include: { usuario: { select: { id: true, nombre: true } } },
          orderBy: { fechaRegistro: 'asc' },
        },
        movimientoStock: {
          include: { usuario: { select: { id: true, nombre: true } } },
          orderBy: { fechaCambio: 'asc' },
        },
      },
    });

    return raw.map((g) => ({
      comentario: g.comentario,
      descripcionProblema: g.descripcionProblema,
      actualizadoEn: g.actualizadoEn,
      id: g.id,
      ventaId: g.ventaId,
      venta: {
        id: g.venta.id,
        fechaVenta: g.venta.fechaVenta.toISOString(),
      },
      fechaRecepcion: g.fechaRecepcion.toISOString(),
      estado: g.estado,
      cantidadDevuelta: g.cantidadDevuelta,
      cliente: { id: g.cliente.id, nombre: g.cliente.nombre },
      producto: {
        id: g.producto.id,
        nombre: g.producto.nombre,
        codigo: g.producto.codigoProducto,
        descripcion: g.producto.descripcion,
      },
      proveedor: g.proveedor
        ? { id: g.proveedor.id, nombre: g.proveedor.nombre }
        : undefined,
      usuarioRecibe: g.usuarioRecibe
        ? { id: g.usuarioRecibe.id, nombre: g.usuarioRecibe.nombre }
        : undefined,
      registros: g.registros.map((r) => ({
        id: r.id,
        estado: r.estado,
        fechaRegistro: r.fechaRegistro.toISOString(),
        accionesRealizadas: r.accionesRealizadas,
        conclusion: r.conclusion,

        usuario: r.usuario
          ? { id: r.usuario.id, nombre: r.usuario.nombre }
          : undefined,
      })),
      movimientoStock: g.movimientoStock.map((m) => ({
        id: m.id,
        cantidadAnterior: m.cantidadAnterior,
        cantidadNueva: m.cantidadNueva,
        fechaCambio: m.fechaCambio.toISOString(),
        usuario: { id: m.usuario.id, nombre: m.usuario.nombre },
      })),
    }));
  }

  /**
   *
   * @returns array de garantias para mapeo de historial
   */
  async getAllGarantias(): Promise<GarantiaDto[]> {
    const raw = await this.prisma.garantia.findMany({
      include: {
        venta: { select: { id: true, fechaVenta: true } },
        cliente: { select: { id: true, nombre: true } },
        producto: {
          select: {
            id: true,
            nombre: true,
            codigoProducto: true,
            descripcion: true,
          },
        },
        proveedor: { select: { id: true, nombre: true } },
        usuarioRecibe: { select: { id: true, nombre: true } },
        registros: {
          include: { usuario: { select: { id: true, nombre: true } } },
          orderBy: { fechaRegistro: 'asc' },
        },
        movimientoStock: {
          include: { usuario: { select: { id: true, nombre: true } } },
          orderBy: { fechaCambio: 'asc' },
        },
      },
    });

    return raw.map((g) => ({
      comentario: g.comentario,
      descripcionProblema: g.descripcionProblema,
      actualizadoEn: g.actualizadoEn,
      id: g.id,
      ventaId: g.ventaId,
      venta: {
        id: g.venta.id,
        fechaVenta: g.venta.fechaVenta.toISOString(),
      },
      fechaRecepcion: g.fechaRecepcion.toISOString(),
      estado: g.estado,
      cantidadDevuelta: g.cantidadDevuelta,
      cliente: { id: g.cliente.id, nombre: g.cliente.nombre },
      producto: {
        id: g.producto.id,
        nombre: g.producto.nombre,
        codigo: g.producto.codigoProducto,
        descripcion: g.producto.descripcion,
      },
      proveedor: g.proveedor
        ? { id: g.proveedor.id, nombre: g.proveedor.nombre }
        : undefined,
      usuarioRecibe: g.usuarioRecibe
        ? { id: g.usuarioRecibe.id, nombre: g.usuarioRecibe.nombre }
        : undefined,
      registros: g.registros.map((r) => ({
        id: r.id,
        estado: r.estado,
        fechaRegistro: r.fechaRegistro.toISOString(),
        accionesRealizadas: r.accionesRealizadas,
        conclusion: r.conclusion,

        usuario: r.usuario
          ? { id: r.usuario.id, nombre: r.usuario.nombre }
          : undefined,
      })),
      movimientoStock: g.movimientoStock.map((m) => ({
        id: m.id,
        cantidadAnterior: m.cantidadAnterior,
        cantidadNueva: m.cantidadNueva,
        fechaCambio: m.fechaCambio.toISOString(),
        usuario: { id: m.usuario.id, nombre: m.usuario.nombre },
      })),
    }));
  }
}
