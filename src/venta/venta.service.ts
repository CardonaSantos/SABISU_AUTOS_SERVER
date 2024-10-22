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
      monto,
      productos,
      metodoPago,
      nombreClienteFinal,
      telefonoClienteFinal,
      direccionClienteFinal,
    } = createVentaDto;

    try {
      // Consolidar los productos por productoId sumando sus cantidades
      const productosConsolidados = createVentaDto.productos.reduce(
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

      // 1. Obtener productos necesarios y verificar disponibilidad de stock en la sucursal
      const productos = await this.prisma.producto.findMany({
        where: {
          id: {
            in: productosConsolidados.map((prod) => prod.productoId),
          },
        },
      });

      const stockUpdates = [];

      for (const prod of productosConsolidados) {
        const producto = productos.find((p) => p.id === prod.productoId);
        if (!producto)
          throw new Error(`Producto con ID ${prod.productoId} no encontrado`);

        // Obtener los registros de stock de la sucursal correspondiente
        const stocks = await this.prisma.stock.findMany({
          where: {
            productoId: producto.id,
            sucursalId: sucursalId, // Filtrar por la sucursalId
          },
          orderBy: { fechaIngreso: 'asc' }, // FIFO: los más antiguos primero
        });

        let cantidadRestante = prod.cantidad;

        for (const stock of stocks) {
          if (cantidadRestante <= 0) break; // Si ya hemos descontado todo lo necesario, detenemos el proceso

          if (stock.cantidad >= cantidadRestante) {
            // Si el stock actual puede cubrir todo lo que falta, lo descontamos de aquí
            stockUpdates.push({
              id: stock.id,
              cantidad: stock.cantidad - cantidadRestante,
            });
            cantidadRestante = 0;
          } else {
            // Si el stock actual no cubre todo lo que falta, usamos todo lo que tiene y seguimos con el siguiente
            stockUpdates.push({
              id: stock.id,
              cantidad: 0, // Este stock se agota
            });
            cantidadRestante -= stock.cantidad; // Restamos lo que tenía este stock
          }
        }

        if (cantidadRestante > 0) {
          throw new InternalServerErrorException(
            `No hay suficiente stock para el producto ${producto.nombre} en la sucursal ${sucursalId}`,
          );
        }
      }

      // 2. Actualizar el stock en la sucursal específica en una sola transacción
      await this.prisma.$transaction(
        stockUpdates.map((stock) =>
          this.prisma.stock.update({
            where: { id: stock.id }, // Asegurarse de actualizar el stock correcto
            data: { cantidad: stock.cantidad },
          }),
        ),
      );

      // 3. Calcular el total de la venta
      const totalVenta = productosConsolidados.reduce((total, prod) => {
        const producto = productos.find((p) => p.id === prod.productoId);
        return total + (producto ? producto.precioVenta * prod.cantidad : 0);
      }, 0);

      // 4. Crear la venta
      const venta = await this.prisma.venta.create({
        data: {
          cliente: clienteId ? { connect: { id: clienteId } } : undefined,
          horaVenta: new Date(),
          totalVenta,
          nombreClienteFinal: nombreClienteFinal,
          telefonoClienteFinal: telefonoClienteFinal,
          direccionClienteFinal: direccionClienteFinal,
          sucursal: {
            connect: {
              id: sucursalId,
            },
          },
          productos: {
            create: productosConsolidados.map((prod) => ({
              producto: { connect: { id: prod.productoId } },
              cantidad: prod.cantidad,
            })),
          },
        },
      });

      // 5. Hacer el registro de pago
      const payM = await this.prisma.pago.create({
        data: {
          metodoPago: metodoPago,
          monto: venta.totalVenta,
          venta: { connect: { id: venta.id } },
        },
      });

      // Vincular el pago con la venta
      await this.prisma.venta.update({
        where: { id: venta.id },
        data: {
          metodoPago: {
            connect: {
              id: payM.id,
            },
          },
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
