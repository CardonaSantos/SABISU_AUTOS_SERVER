import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCuotaDto } from './dto/create-cuota.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateVentaCuotaDto } from './dto/update-cuota.dto';
import { CreateVentaCuotaDto } from './dto/create-ventacuota.dto';
import { CreatePlantillaComprobanteDto } from './dto/plantilla-comprobante.dt';
import { CuotaDto } from './dto/registerNewPay';

@Injectable()
export class CuotasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVentaCuotaDto: CreateVentaCuotaDto) {
    try {
      console.log('Los datos entrantes son: ', createVentaCuotaDto);
      // 1. Primero, crear la venta
      const venta = await this.prisma.venta.create({
        data: {
          clienteId: Number(createVentaCuotaDto.clienteId),
          sucursalId: Number(createVentaCuotaDto.sucursalId),
          totalVenta: Number(createVentaCuotaDto.totalVenta),
          productos: {
            create: createVentaCuotaDto.productos.map((producto) => ({
              productoId: Number(producto.productoId),
              cantidad: Number(producto.cantidad),
              precioVenta: Number(producto.precioVenta),
            })),
          },
        },
      });
      console.log('La venta creada es: ', venta);
      // 2. Crear el pago
      const pago = await this.prisma.pago.create({
        data: {
          ventaId: venta.id,
          monto: createVentaCuotaDto.cuotaInicial, // Monto inicial pagado
          metodoPago: 'OTRO', // Método de pago para ventas a crédito (cuotas)
          fechaPago: new Date(),
        },
      });
      console.log('El pago registrado es: ', pago);
      // 3. Verificar que los productos existan antes de crear la venta cuota
      const productosExistentes = await this.prisma.producto.findMany({
        where: {
          id: {
            in: createVentaCuotaDto.productos.map(
              (producto) => producto.productoId,
            ),
          },
        },
      });

      if (productosExistentes.length !== createVentaCuotaDto.productos.length) {
        throw new BadRequestException(
          'Algunos productos no existen en la base de datos',
        );
      }

      // 4. Crear los registros de la relación VentaProducto
      const ventaProductos = await Promise.all(
        createVentaCuotaDto.productos.map((prod) =>
          this.prisma.ventaProducto.create({
            data: {
              cantidad: prod.cantidad,
              precioVenta: prod.precioVenta,
              productoId: prod.productoId,
              ventaId: venta.id,
            },
          }),
        ),
      );

      console.log('Productos asociados a la venta: ', ventaProductos);

      // 5. Crear la venta a cuota y asociar los productos
      const ventaCuota = await this.prisma.ventaCuota.create({
        data: {
          clienteId: Number(createVentaCuotaDto.clienteId),
          usuarioId: Number(createVentaCuotaDto.usuarioId),
          sucursalId: Number(createVentaCuotaDto.sucursalId),
          totalVenta: Number(createVentaCuotaDto.totalVenta),
          cuotaInicial: Number(createVentaCuotaDto.cuotaInicial),
          cuotasTotales: Number(createVentaCuotaDto.cuotasTotales),
          fechaInicio: new Date(createVentaCuotaDto.fechaInicio),
          diasEntrePagos: Number(createVentaCuotaDto.diasEntrePagos),
          interes: Number(createVentaCuotaDto.interes),
          estado: createVentaCuotaDto.estado,
          dpi: createVentaCuotaDto.dpi,
          testigos: createVentaCuotaDto.testigos ?? null,

          fechaContrato: createVentaCuotaDto.fechaContrato
            ? new Date(createVentaCuotaDto.fechaContrato)
            : null,
          montoVenta: Number(createVentaCuotaDto.montoVenta),
          garantiaMeses: Number(createVentaCuotaDto.garantiaMeses),
          productos: {
            create: ventaProductos.map((vp) => ({
              cantidad: vp.cantidad,
              precioVenta: vp.precioVenta,
              productoId: vp.productoId,
              ventaId: vp.ventaId,
            })),
          },
          totalPagado: Number(createVentaCuotaDto.cuotaInicial),
        },
      });

      console.log('La venta cuota es: ', ventaCuota);

      return ventaCuota;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al crear la venta a cuota');
    }
  }

  async createPlantilla(
    createPlantillaComprobanteDto: CreatePlantillaComprobanteDto,
  ) {
    try {
      const plantilla = await this.prisma.plantillaComprobante.create({
        data: {
          nombre: createPlantillaComprobanteDto.nombre,
          texto: createPlantillaComprobanteDto.texto,
          sucursalId: createPlantillaComprobanteDto.sucursalId || null,
        },
      });
      return plantilla;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error');
    }
  }

  async registerNewPay(createCuotaDto: CuotaDto) {
    try {
      const newRegist = await this.prisma.cuota.create({
        data: {
          ventaCuotaId: createCuotaDto.ventaCuotaId,
          monto: createCuotaDto.monto,
          estado: createCuotaDto.estado,
          usuarioId: createCuotaDto.usuarioId,
        },
      });

      return newRegist;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al registrar pago de cuota');
    }
  }

  async getCredutsWithoutPaying() {
    const credits = await this.prisma.ventaCuota.findMany({
      where: {
        estado: {
          notIn: ['CANCELADA', 'COMPLETADA'],
        },
      },
      orderBy: {
        creadoEn: 'desc',
      },
      include: {
        cuotas: {
          select: {
            id: true,
            creadoEn: true,
            estado: true,
            monto: true,
            fechaPago: true,
          },
        },
        cliente: {
          select: {
            id: true,
            nombre: true,
          },
        },
        productos: {
          orderBy: {
            precioVenta: 'desc',
          },
          include: {
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
          select: {
            id: true,
            nombre: true,
            direccion: true,
          },
        },
        usuario: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });
    return credits;
  }

  async getPlantillas() {
    try {
      const plantillas = await this.prisma.plantillaComprobante.findMany({
        orderBy: {
          creadoEn: 'desc',
        },
      });
      return plantillas;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al conseguir la plantilla');
    }
  }

  async getAllCredits() {
    try {
      const credits = await this.prisma.ventaCuota.findMany({
        orderBy: {
          creadoEn: 'desc',
        },
        include: {
          cliente: {
            select: {
              id: true,
              nombre: true,
            },
          },
          productos: {
            orderBy: {
              precioVenta: 'desc',
            },
            include: {
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
            select: {
              id: true,
              nombre: true,
              direccion: true,
            },
          },
          usuario: {
            select: {
              id: true,
              nombre: true,
            },
          },

          ///
        },
      });
      return credits;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error');
    }
  }

  async getPlantilla(id: number) {
    try {
      const plantilla = await this.prisma.plantillaComprobante.findUnique({
        where: {
          id,
        },
      });
      return plantilla.texto;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al conseguir la plantilla');
    }
  }

  async getPlantillaToEdit(id: number) {
    try {
      const plantilla = await this.prisma.plantillaComprobante.findUnique({
        where: {
          id,
        },
      });
      return plantilla;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al conseguir la plantilla');
    }
  }

  async getCuota(id: number) {
    try {
      const cuota = this.prisma.ventaCuota.findUnique({
        where: {
          id,
        },
        include: {
          cliente: {
            select: {
              id: true,
              nombre: true,
            },
          },
          productos: {
            orderBy: {
              precioVenta: 'desc',
            },
            include: {
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
            select: {
              id: true,
              nombre: true,
              direccion: true,
            },
          },
          usuario: {
            select: {
              id: true,
              nombre: true,
            },
          },
          ///
        },
      });
      return cuota;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteAll() {
    try {
      const regists = await this.prisma.ventaCuota.deleteMany({});
      return regists;
    } catch (error) {
      console.log(error);

      throw new BadRequestException('Error');
    }
  }

  async deleteAllPlantillas() {
    try {
      const regists = await this.prisma.plantillaComprobante.deleteMany({});
      return regists;
    } catch (error) {
      console.log(error);

      throw new BadRequestException('Error');
    }
  }

  async deleteOnePlaceholder(id: number) {
    try {
      const response = await this.prisma.plantillaComprobante.delete({
        where: {
          id,
        },
      });
      return response;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al eliminar registro');
    }
  }

  async updatePlantilla(
    id: number,
    createPlantillaComprobanteDto: CreatePlantillaComprobanteDto,
  ) {
    console.log('los datos son: ', createPlantillaComprobanteDto);

    try {
      const placeholderToUpdate = await this.prisma.plantillaComprobante.update(
        {
          where: {
            id,
          },
          data: {
            nombre: createPlantillaComprobanteDto.nombre,
            texto: createPlantillaComprobanteDto.texto,
          },
        },
      );

      return placeholderToUpdate;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al actualizar registro');
    }
  }
}
