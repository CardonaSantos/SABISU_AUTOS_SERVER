import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VentaService {
  //
  constructor(private readonly prisma: PrismaService) {}

  async create(createVentaDto: CreateVentaDto) {
    const {
      sucursalId,
      clienteId,
      productos,
      metodoPago,
      nombreClienteFinal,
      telefonoClienteFinal,
      direccionClienteFinal,
    } = createVentaDto;

    try {
      // Obtener y validar los productos y precios
      const productosConsolidados = await Promise.all(
        productos.map(async (prod) => {
          const precioProducto = await this.prisma.precioProducto.findUnique({
            where: { id: prod.selectedPriceId, productoId: prod.productoId },
          });

          if (!precioProducto || precioProducto.usado) {
            throw new Error(
              `El precio no está disponible para el producto ${prod.productoId}`,
            );
          }

          return {
            ...prod,
            precioVenta: precioProducto.precio,
            tipoPrecio: precioProducto.tipo,
          };
        }),
      );

      // Consolidar los productos por productoId sumando sus cantidades
      const productosConsolidadosFinales = productosConsolidados.reduce(
        (acc, prod) => {
          const existingProduct = acc.find(
            (p) => p.productoId === prod.productoId,
          );
          if (existingProduct) {
            existingProduct.cantidad += prod.cantidad;
          } else {
            acc.push(prod);
          }
          return acc;
        },
        [],
      );

      const stockUpdates = [];

      // Verificar disponibilidad de stock y preparar actualizaciones
      for (const prod of productosConsolidadosFinales) {
        const producto = await this.prisma.producto.findUnique({
          where: { id: prod.productoId },
        });

        if (!producto) {
          throw new Error(`Producto con ID ${prod.productoId} no encontrado`);
        }

        // Obtener registros de stock en la sucursal
        const stocks = await this.prisma.stock.findMany({
          where: {
            productoId: producto.id,
            sucursalId: sucursalId,
          },
          orderBy: { fechaIngreso: 'asc' },
        });

        let cantidadRestante = prod.cantidad;

        for (const stock of stocks) {
          if (cantidadRestante <= 0) break;

          if (stock.cantidad >= cantidadRestante) {
            stockUpdates.push({
              id: stock.id,
              cantidad: stock.cantidad - cantidadRestante,
            });
            cantidadRestante = 0;
          } else {
            stockUpdates.push({
              id: stock.id,
              cantidad: 0,
            });
            cantidadRestante -= stock.cantidad;
          }
        }

        if (cantidadRestante > 0) {
          throw new InternalServerErrorException(
            `No hay suficiente stock para el producto ${producto.nombre} en la sucursal ${sucursalId}`,
          );
        }
      }

      // Actualizar el stock en la sucursal específica en una sola transacción
      await this.prisma.$transaction(
        stockUpdates.map((stock) =>
          this.prisma.stock.update({
            where: { id: stock.id },
            data: { cantidad: stock.cantidad },
          }),
        ),
      );

      // Calcular total de la venta
      const totalVenta = productosConsolidadosFinales.reduce((total, prod) => {
        return total + prod.precioVenta * prod.cantidad;
      }, 0);

      // Crear la venta
      const venta = await this.prisma.venta.create({
        data: {
          cliente: clienteId ? { connect: { id: clienteId } } : undefined,
          horaVenta: new Date(),
          totalVenta,
          nombreClienteFinal,
          telefonoClienteFinal,
          direccionClienteFinal,
          sucursal: { connect: { id: sucursalId } },
          productos: {
            create: productosConsolidadosFinales.map((prod) => ({
              producto: { connect: { id: prod.productoId } },
              cantidad: prod.cantidad,
              precioVenta: prod.precioVenta,
            })),
          },
        },
      });

      // Marcar precios como usados si es necesario
      await Promise.all(
        productosConsolidadosFinales.map(async (prod) => {
          if (prod.tipoPrecio === 'CREADO_POR_SOLICITUD') {
            await this.prisma.precioProducto.delete({
              where: { id: prod.selectedPriceId },
              // data: { usado: true },
            });
          }
        }),
      );

      // Registro del pago
      const payM = await this.prisma.pago.create({
        data: {
          metodoPago,
          monto: venta.totalVenta,
          venta: { connect: { id: venta.id } },
        },
      });

      // Vincular el pago con la venta
      await this.prisma.venta.update({
        where: { id: venta.id },
        data: {
          metodoPago: { connect: { id: payM.id } },
        },
      });

      console.log('La venta hecha es: ', venta);
      return venta;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al crear la venta');
    }
  }

  async findAll() {
    try {
      const ventas = await this.prisma.venta.findMany({
        include: {
          cliente: true,
          metodoPago: true,
          productos: {
            include: {
              producto: true,
            },
          },
        },
        orderBy: {
          fechaVenta: 'desc',
        },
      });
      return ventas;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al obtener las ventas');
    }
  }

  async findOneSale(id: number) {
    try {
      const ventas = await this.prisma.venta.findUnique({
        where: {
          id: id,
        },
        include: {
          cliente: true,
          metodoPago: true,
          sucursal: {
            select: {
              direccion: true,
              nombre: true,
              id: true,
              telefono: true,
              pxb: true,
            },
          },
          productos: {
            include: {
              producto: true,
            },
          },
        },
      });
      return ventas;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al obtener las ventas');
    }
  }

  async update(id: number, updateVentaDto: UpdateVentaDto) {
    try {
      const venta = await this.prisma.venta.update({
        where: { id },
        data: {
          productos: {
            connect: updateVentaDto.productos.map((prod) => ({
              id: prod.productoId,
            })),
          },
        },
      });

      if (!venta) {
        throw new NotFoundException(`Venta con ID ${id} no encontrada`);
      }
      return venta;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al actualizar la venta');
    }
  }

  async removeAll() {
    try {
      const ventas = await this.prisma.venta.deleteMany({});
      return ventas;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al eliminar las ventas');
    }
  }

  async remove(id: number) {
    try {
      const venta = await this.prisma.venta.delete({
        where: { id },
      });
      if (!venta) {
        throw new NotFoundException(`Venta con ID ${id} no encontrada`);
      }
      return venta;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al eliminar la venta');
    }
  }
}
