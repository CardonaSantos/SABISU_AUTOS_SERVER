import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateHistorialStockDto } from './dto/create-historial-stock.dto';
import { UpdateHistorialStockDto } from './dto/update-historial-stock.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TipoMovimientoStock } from '@prisma/client';

const baseSelect: any = {
  id: true,
  comentario: true,
  usuario: {
    select: { id: true, nombre: true, rol: true, correo: true },
  },
  cantidadAnterior: true,
  cantidadNueva: true,
  tipo: true,
  fechaCambio: true,
  sucursal: {
    select: { id: true, nombre: true, direccion: true },
  },
  producto: {
    select: {
      id: true,
      nombre: true,
      codigoProducto: true,
      codigoProveedor: true,
      categorias: true,
      descripcion: true,
      imagenesProducto: true,
    },
  },
};

@Injectable()
export class HistorialStockService {
  private readonly logger = new Logger(HistorialStockService.name);
  constructor(private readonly prisma: PrismaService) {}

  create(createHistorialStockDto: CreateHistorialStockDto) {
    return 'This action adds a new historialStock';
  }

  async getHistorialStockCambios(params: {
    tipo?: TipoMovimientoStock;
    page?: number;
    pageSize?: number;
  }) {
    const { tipo, page = 1, pageSize = 20 } = params;
    const where = tipo ? { tipo } : {};

    console.log('Los datos del tipo son: ', tipo);
    console.log('Los datos del page son: ', page);
    console.log('Los datos del pageSize son: ', pageSize);
    console.log('El tipon 2 es: ', where);

    const baseSelect: any = {
      id: true,
      comentario: true,
      usuario: {
        select: { id: true, nombre: true, rol: true, correo: true },
      },
      cantidadAnterior: true,
      cantidadNueva: true,
      tipo: true,
      fechaCambio: true,
      sucursal: {
        select: { id: true, nombre: true, direccion: true },
      },
      producto: {
        select: {
          id: true,
          nombre: true,
          codigoProducto: true,
          codigoProveedor: true,
          categorias: true,
          descripcion: true,
          imagenesProducto: true,
        },
      },
    };

    //EN BASE A LOS TIPOS QUE SOLICITEN

    if (tipo === 'INGRESO_REQUISICION') {
      baseSelect.requisicion = {
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          estado: true,
          folio: true,
          fecha: true,
          fechaRecepcion: true,
          ingresadaAStock: true,
          sucursal: {
            select: {
              id: true,
              nombre: true,
            },
          },
          observaciones: true,
          usuario: {
            select: {
              id: true,
              nombre: true,
              rol: true,
            },
          },
        },
      };
    }

    if (tipo === 'SALIDA_VENTA') {
      baseSelect.venta = {
        select: {
          id: true,
          cantidad: true,
          creadoEn: true,
          precioVenta: true,
          producto: {
            select: {
              id: true,
              nombre: true,
              codigoProducto: true,
            },
          },
          venta: {
            select: {
              id: true,
              metodoPago: true,
              cliente: {
                select: {
                  id: true,
                  nombre: true,
                  telefono: true,
                },
              },
              fechaVenta: true,
              sucursal: {
                select: {
                  id: true,
                  nombre: true,
                  direccion: true,
                },
              },
            },
          },
        },
      };
    }

    if (tipo === 'AJUSTE_STOCK') {
      baseSelect.ajusteStock = {
        select: {
          id: true,
          cantidadAjustada: true,
          descripcion: true,
          fechaHora: true,
          tipoAjuste: true,
          usuario: {
            select: {
              id: true,
              nombre: true,
              correo: true,
              rol: true,
            },
          },
          stock: {
            select: {
              id: true,
              fechaIngreso: true,
              fechaVencimiento: true,
              cantidadInicial: true,
              creadoEn: true,
              actualizadoEn: true,
            },
          },
        },
      };
    }

    if (tipo === 'ELIMINACION_STOCK') {
      baseSelect.eliminacionStock = {
        select: {
          id: true,
          createdAt: true,
          producto: {
            select: {
              id: true,
              nombre: true,
              codigoProducto: true,
              codigoProveedor: true,
              descripcion: true,
            },
          },
          usuario: {
            select: {
              id: true,
              nombre: true,
              correo: true,
              rol: true,
            },
          },
          sucursal: {
            select: {
              id: true,
              nombre: true,
              direccion: true,
            },
          },
          cantidadAnterior: true,
          motivo: true,
          stockRestante: true,
          cantidadStockEliminada: true,
        },
      };
    }

    if (tipo === 'ELIMINACION_VENTA') {
      baseSelect.eliminacionVenta = {
        select: {
          id: true,
          cliente: {
            select: {
              id: true,
              nombre: true,
            },
          },
          fechaEliminacion: true,
          sucursal: {
            select: {
              id: true,
              nombre: true,
              direccion: true,
            },
          },
          motivo: true,
          usuario: {
            select: {
              id: true,
              nombre: true,
              correo: true,
              rol: true,
            },
          },
        },
      };
    }

    if (tipo === 'TRANSFERENCIA') {
      baseSelect.transferenciaProducto = {
        select: {
          id: true,
          cantidad: true,
          fechaTransferencia: true,
          producto: {
            select: {
              id: true,
              nombre: true,
              codigoProducto: true,
              codigoProveedor: true,
              descripcion: true,
            },
          },
          sucursalDestino: {
            select: {
              id: true,
              nombre: true,
              direccion: true,
            },
          },
          sucursalOrigen: {
            select: {
              id: true,
              nombre: true,
              direccion: true,
            },
          },
          usuarioEncargado: {
            select: {
              id: true,
              nombre: true,
              correo: true,
              rol: true,
            },
          },
        },
      };
    }

    if (tipo === 'ENTREGA_STOCK') {
      baseSelect.entregaStock = {
        select: {
          id: true,
          fechaEntrega: true,
          montoTotal: true,
          sucursal: {
            select: {
              id: true,
              nombre: true,
              direccion: true,
            },
          },
          proveedor: {
            select: {
              id: true,
              nombre: true,
            },
          },
          usuarioRecibido: {
            select: {
              id: true,
              nombre: true,
              correo: true,
              rol: true,
            },
          },
        },
      };
    }

    try {
      const registros = await this.prisma.historialStock.findMany({
        where,
        orderBy: { fechaCambio: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: baseSelect,
      });

      const total = await this.prisma.historialStock.count({ where });

      return { data: registros, page, pageSize, totalItems: total };
    } catch (error) {
      this.logger.error('Error al obtener historialStock:', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException({
        message: 'Fatal Error: Error inesperado',
      });
    }
  }

  //para requisiciones
  async getIngresoRequisicion(params: { page?: number; pageSize?: number }) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const where = { tipo: TipoMovimientoStock.INGRESO_REQUISICION };
    const select = {
      id: true,
      comentario: true,
      usuario: {
        select: { id: true, nombre: true, rol: true, correo: true },
      },
      cantidadAnterior: true,
      cantidadNueva: true,
      tipo: true,
      fechaCambio: true,
      sucursal: {
        select: { id: true, nombre: true, direccion: true },
      },
      producto: {
        select: {
          id: true,
          nombre: true,
          codigoProducto: true,
          codigoProveedor: true,
          categorias: true,
          descripcion: true,
          imagenesProducto: true,
        },
      },
      requisicion: {
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          estado: true,
          folio: true,
          fecha: true,
          fechaRecepcion: true,
          ingresadaAStock: true,
          sucursal: {
            select: {
              id: true,
              nombre: true,
            },
          },
          observaciones: true,
          usuario: {
            select: {
              id: true,
              nombre: true,
              rol: true,
            },
          },
        },
      },
    };

    try {
      // 1) Registros
      const registros = await this.prisma.historialStock.findMany({
        where,
        orderBy: { fechaCambio: 'desc' },
        skip,
        take,
        select,
      });

      // 2) Total
      const totalItems = await this.prisma.historialStock.count({ where });

      console.log('Los registros son: ', registros);

      // 3) Retorno paginado
      return {
        data: registros,
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      };
    } catch (error) {
      this.logger.error('Error al obtener ingresos por requisición:', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Error inesperado al cargar requisiciones',
      );
    }
  }
  //para salida de ventas
  async getSalidaVenta(params: { page?: number; pageSize?: number }) {
    const { page = 1, pageSize = 20 } = params;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const where = { tipo: TipoMovimientoStock.SALIDA_VENTA };
    const registros = await this.prisma.historialStock.findMany({
      where,
      orderBy: { fechaCambio: 'desc' },
      skip,
      take,
      select: {
        id: true,
        comentario: true,
        cantidadAnterior: true,
        cantidadNueva: true,
        tipo: true,
        fechaCambio: true,
        sucursal: { select: { id: true, nombre: true, direccion: true } },
        usuario: {
          select: { id: true, nombre: true, rol: true, correo: true },
        },
        producto: { select: { id: true, nombre: true, codigoProducto: true } },

        // <-- Aquí la nueva relación a Venta:
        venta: {
          select: {
            id: true,
            fechaVenta: true,
            horaVenta: true,
            totalVenta: true,
            imei: true,
            // Si usas venta.metodoPagoId como FK:
            metodoPago: { select: { id: true, metodoPago: true, monto: true } },
            // Datos del cliente:
            cliente: {
              select: {
                id: true,
                nombre: true,
                telefono: true,
                direccion: true,
              },
            },
            // Y por fin, el detalle de productos vendidos
            productos: {
              select: {
                id: true,
                productoId: true,
                cantidad: true,
                precioVenta: true,
                producto: {
                  select: {
                    id: true,
                    nombre: true,
                    codigoProducto: true,
                  },
                },
              },
            },
            sucursal: {
              select: { id: true, nombre: true, direccion: true },
            },
          },
        },
      },
    });

    const totalItems = await this.prisma.historialStock.count({ where });
    return {
      data: registros,
      page,
      pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / pageSize),
    };
  }

  //para austes stocks
  async getAjusteStock(params: { page?: number; pageSize?: number }) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const where = { tipo: TipoMovimientoStock.AJUSTE_STOCK };
    const select = {
      id: true,
      comentario: true,
      usuario: {
        select: { id: true, nombre: true, correo: true, rol: true },
      },
      cantidadAnterior: true,
      cantidadNueva: true,
      tipo: true,
      fechaCambio: true,
      sucursal: {
        select: { id: true, nombre: true, direccion: true },
      },
      producto: {
        select: {
          id: true,
          nombre: true,
          codigoProducto: true,
          codigoProveedor: true,
          categorias: true,
          descripcion: true,
          imagenesProducto: true,
        },
      },
      ajusteStock: {
        select: {
          id: true,
          cantidadAjustada: true,
          descripcion: true,
          fechaHora: true,
          tipoAjuste: true,
          usuario: {
            select: {
              id: true,
              nombre: true,
              correo: true,
              rol: true,
            },
          },
          stock: {
            select: {
              id: true,
              fechaIngreso: true,
              fechaVencimiento: true,
              cantidadInicial: true,
              creadoEn: true,
              actualizadoEn: true,
            },
          },
        },
      },
    };

    try {
      // 1) Registros paginados
      const registros = await this.prisma.historialStock.findMany({
        where,
        orderBy: { fechaCambio: 'desc' },
        skip,
        take,
        select,
      });

      // 2) Total de items
      const totalItems = await this.prisma.historialStock.count({ where });

      // 3) Retorno paginado
      return {
        data: registros,
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      };
    } catch (error) {
      this.logger.error('Error al obtener ajustes de stock:', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Error inesperado al cargar historial de ajustes de stock',
      );
    }
  }

  //para eliminaciones
  async getEliminacionStock(params: { page?: number; pageSize?: number }) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const where = { tipo: TipoMovimientoStock.ELIMINACION_STOCK };
    const select = {
      id: true,
      comentario: true,
      usuario: {
        select: { id: true, nombre: true, correo: true, rol: true },
      },
      cantidadAnterior: true,
      cantidadNueva: true,
      tipo: true,
      fechaCambio: true,
      sucursal: {
        select: { id: true, nombre: true, direccion: true },
      },
      producto: {
        select: {
          id: true,
          nombre: true,
          codigoProducto: true,
          codigoProveedor: true,
          descripcion: true,
        },
      },
      eliminacionStock: {
        select: {
          id: true,
          createdAt: true,
          producto: {
            select: {
              id: true,
              nombre: true,
              codigoProducto: true,
              codigoProveedor: true,
              descripcion: true,
            },
          },
          usuario: {
            select: {
              id: true,
              nombre: true,
              correo: true,
              rol: true,
            },
          },
          sucursal: {
            select: {
              id: true,
              nombre: true,
              direccion: true,
            },
          },
          cantidadAnterior: true,
          motivo: true,
          stockRestante: true,
          cantidadStockEliminada: true,
        },
      },
    };

    try {
      // 1) Obtener registros
      const registros = await this.prisma.historialStock.findMany({
        where,
        orderBy: { fechaCambio: 'desc' },
        skip,
        take,
        select,
      });

      // 2) Contar total de items
      const totalItems = await this.prisma.historialStock.count({ where });

      // 3) Devolver paginado
      return {
        data: registros,
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      };
    } catch (error) {
      this.logger.error('Error al obtener eliminaciones de stock:', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Error inesperado al cargar historial de eliminaciones de stock',
      );
    }
  }

  //para eliminaciones de ventas
  async getEliminacionVenta(params: { page?: number; pageSize?: number }) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const where = { tipo: TipoMovimientoStock.ELIMINACION_VENTA };
    const select = {
      id: true,
      comentario: true,
      usuario: {
        select: { id: true, nombre: true, correo: true, rol: true },
      },
      cantidadAnterior: true,
      cantidadNueva: true,
      tipo: true,
      fechaCambio: true,
      sucursal: {
        select: { id: true, nombre: true, direccion: true },
      },
      producto: {
        select: {
          id: true,
          nombre: true,
          codigoProducto: true,
          codigoProveedor: true,
          descripcion: true,
        },
      },
      eliminacionVenta: {
        select: {
          id: true,
          cliente: {
            select: {
              id: true,
              nombre: true,
            },
          },
          fechaEliminacion: true,
          sucursal: {
            select: {
              id: true,
              nombre: true,
              direccion: true,
            },
          },
          motivo: true,
          usuario: {
            select: {
              id: true,
              nombre: true,
              correo: true,
              rol: true,
            },
          },
        },
      },
    };

    try {
      // 1) Registros paginados
      const registros = await this.prisma.historialStock.findMany({
        where,
        orderBy: { fechaCambio: 'desc' },
        skip,
        take,
        select,
      });

      // 2) Conteo total
      const totalItems = await this.prisma.historialStock.count({ where });

      // 3) Retorno
      return {
        data: registros,
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      };
    } catch (error) {
      this.logger.error('Error al obtener eliminaciones de venta:', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Error inesperado al cargar historial de eliminaciones de venta',
      );
    }
  }
  //para transferencias
  async getTransferencia(params: { page?: number; pageSize?: number }) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const where = { tipo: TipoMovimientoStock.TRANSFERENCIA };
    const select = {
      id: true,
      comentario: true,
      usuario: {
        select: { id: true, nombre: true, correo: true, rol: true },
      },
      cantidadAnterior: true,
      cantidadNueva: true,
      tipo: true,
      fechaCambio: true,
      sucursal: {
        select: { id: true, nombre: true, direccion: true },
      },
      producto: {
        select: {
          id: true,
          nombre: true,
          codigoProducto: true,
          codigoProveedor: true,
          categorias: true,
          descripcion: true,
          imagenesProducto: true,
        },
      },
      transferenciaProducto: {
        select: {
          id: true,
          cantidad: true,
          fechaTransferencia: true,
          producto: {
            select: {
              id: true,
              nombre: true,
              codigoProducto: true,
              codigoProveedor: true,
              descripcion: true,
            },
          },
          sucursalDestino: {
            select: {
              id: true,
              nombre: true,
              direccion: true,
            },
          },
          sucursalOrigen: {
            select: {
              id: true,
              nombre: true,
              direccion: true,
            },
          },
          usuarioEncargado: {
            select: {
              id: true,
              nombre: true,
              correo: true,
              rol: true,
            },
          },
        },
      },
    };

    try {
      // 1) Registros paginados
      const registros = await this.prisma.historialStock.findMany({
        where,
        orderBy: { fechaCambio: 'desc' },
        skip,
        take,
        select,
      });

      // 2) Conteo total
      const totalItems = await this.prisma.historialStock.count({ where });

      // 3) Retorno paginado
      return {
        data: registros,
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      };
    } catch (error) {
      this.logger.error('Error al obtener transferencias de producto:', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Error inesperado al cargar historial de transferencias',
      );
    }
  }
  //para entregas de stock
  async getEntregaStock(params: { page?: number; pageSize?: number }) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const where = { tipo: TipoMovimientoStock.ENTREGA_STOCK };
    const select = {
      id: true,
      comentario: true,
      usuario: {
        select: { id: true, nombre: true, correo: true, rol: true },
      },
      cantidadAnterior: true,
      cantidadNueva: true,
      tipo: true,
      fechaCambio: true,
      sucursal: {
        select: { id: true, nombre: true, direccion: true },
      },
      producto: {
        select: {
          id: true,
          nombre: true,
          codigoProducto: true,
          codigoProveedor: true,
          categorias: true,
          descripcion: true,
          imagenesProducto: true,
        },
      },
      entregaStock: {
        select: {
          id: true,
          fechaEntrega: true,
          montoTotal: true,
          sucursal: {
            select: {
              id: true,
              nombre: true,
              direccion: true,
            },
          },
          proveedor: {
            select: {
              id: true,
              nombre: true,
            },
          },
          usuarioRecibido: {
            select: {
              id: true,
              nombre: true,
              correo: true,
              rol: true,
            },
          },
        },
      },
    };

    try {
      // 1) Obtener registros paginados
      const registros = await this.prisma.historialStock.findMany({
        where,
        orderBy: { fechaCambio: 'desc' },
        skip,
        take,
        select,
      });

      // 2) Contar total de items
      const totalItems = await this.prisma.historialStock.count({ where });

      // 3) Retornar datos paginados
      return {
        data: registros,
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      };
    } catch (error) {
      this.logger.error('Error al obtener entregas de stock:', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Error inesperado al cargar historial de entregas de stock',
      );
    }
  }

  //Para garantias tracker
  async getGarantiasStock(params: { page?: number; pageSize?: number }) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const where = { tipo: TipoMovimientoStock.GARANTIA };
    const select = {
      id: true,
      comentario: true,
      usuario: {
        select: { id: true, nombre: true, correo: true, rol: true },
      },
      cantidadAnterior: true,
      cantidadNueva: true,
      tipo: true,
      fechaCambio: true,
      sucursal: {
        select: { id: true, nombre: true, direccion: true },
      },
      producto: {
        select: {
          id: true,
          nombre: true,
          codigoProducto: true,
          codigoProveedor: true,
          categorias: true,
          descripcion: true,
        },
      },
      garantia: {
        select: {
          id: true,
          creadoEn: true,
          cliente: {
            select: {
              id: true,
              nombre: true,
              direccion: true,
              telefono: true,
            },
          },
          cantidadDevuelta: true,
          comentario: true,
          descripcionProblema: true,
          estado: true,
          fechaRecepcion: true,
          usuarioRecibe: {
            select: {
              id: true,
              nombre: true,
              correo: true,
              rol: true,
            },
          },
          producto: {
            select: {
              id: true,
              nombre: true,
              codigoProducto: true,
              descripcion: true,
            },
          },
        },
      },
    };

    try {
      // 1) Obtener registros paginados
      const registros = await this.prisma.historialStock.findMany({
        where,
        orderBy: { fechaCambio: 'desc' },
        skip,
        take,
        select,
      });

      // 2) Contar total de items
      const totalItems = await this.prisma.historialStock.count({ where });

      // 3) Retornar datos paginados
      return {
        data: registros,
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      };
    } catch (error) {
      this.logger.error('Error al obtener entregas de stock:', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        'Error inesperado al cargar historial de entregas de stock',
      );
    }
  }

  //ELIMINAR TODOS
  async deleteAll() {
    try {
      let registrosEliminados = await this.prisma.historialStock.deleteMany();
      console.log('Los registros elimnados son: ', registrosEliminados);
      return registrosEliminados;
    } catch (error) {
      console.log(error);
    }
  }
}
