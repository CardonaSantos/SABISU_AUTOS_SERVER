import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateSaleDeletedDto } from './dto/create-sale-deleted.dto';
import { UpdateSaleDeletedDto } from './dto/update-sale-deleted.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class SaleDeletedService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSaleDeletedDto: CreateSaleDeletedDto) {
    const {
      usuarioId,
      motivo,
      totalVenta,
      clienteId,
      productos,
      adminPassword,
      sucursalId,
    } = createSaleDeletedDto;

    console.log('Los datos son: ', createSaleDeletedDto);

    // Verificar que el usuario admin y su contraseña coincidan
    const usuarioAdmin = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (
      !usuarioAdmin ||
      !(await bcrypt.compare(adminPassword, usuarioAdmin.contrasena))
    ) {
      throw new UnauthorizedException(
        'Credenciales de administrador incorrectas.',
      );
    }

    // Convertir clienteId a null si es 0
    const clienteIdFinal = clienteId && clienteId > 0 ? clienteId : null;
    // Crear el registro de la venta eliminada
    const ventaEliminada = await this.prisma.ventaEliminada.create({
      data: {
        usuarioId,
        motivo,
        totalVenta,
        clienteId: clienteIdFinal, // `null` si el clienteId es inválido
        sucursalId: createSaleDeletedDto.sucursalId,
      },
    });

    // Asegúrate de que la venta eliminada fue creada correctamente
    if (!ventaEliminada || !ventaEliminada.id) {
      throw new InternalServerErrorException(
        'No se pudo crear la venta eliminada',
      );
    }

    // Crear productos asociados a la venta eliminada
    for (const producto of productos) {
      // Validar el producto antes de intentar crear el registro
      if (!producto.productoId || producto.productoId <= 0) {
        console.error(`Producto inválido:`, producto);
        throw new BadRequestException(
          `Producto inválido: ID = ${producto.productoId}`,
        );
      }

      try {
        const nuevoProducto = await this.prisma.ventaEliminadaProducto.create({
          data: {
            ventaEliminadaId: ventaEliminada.id, // Relación con la venta eliminada
            productoId: producto.productoId, // Validar que este ID existe en la tabla `Producto`
            cantidad: producto.cantidad,
            precioVenta: producto.precioVenta,
          },
        });

        console.log('Producto vinculado exitosamente:', nuevoProducto);
      } catch (error) {
        console.error(
          `Error al vincular el producto ${producto.productoId}:`,
          error.message,
        );
        throw new InternalServerErrorException(
          `Error al vincular el producto ${producto.productoId}.`,
        );
      }
    }

    if (!createSaleDeletedDto.ventaId) {
      throw new BadRequestException('Error id de la venta no encontrado');
    }

    console.log('Eliminando el registro de venta...');
    const ventaToDelete = await this.prisma.venta.delete({
      where: {
        id: createSaleDeletedDto.ventaId,
      },
    });

    await this.prisma.sucursalSaldo.update({
      where: {
        sucursalId: sucursalId,
      },
      data: {
        saldoAcumulado: {
          decrement: totalVenta,
        },
        totalIngresos: {
          decrement: totalVenta,
        },
      },
    });

    return ventaEliminada;
  }

  findAll() {
    return `This action returns all saleDeleted`;
  }

  async findMySalesDeleted(sucursalId: number) {
    try {
      const regists = await this.prisma.ventaEliminada.findMany({
        orderBy: {
          fechaEliminacion: 'desc',
        },
        where: {
          sucursalId,
        },
        include: {
          cliente: {
            select: {
              id: true,
              nombre: true,
              telefono: true,
              dpi: true,
              direccion: true,
            },
          },
          VentaEliminadaProducto: {
            select: {
              id: true,
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
          usuario: {
            select: {
              id: true,
              nombre: true,
              rol: true,
            },
          },
        },
      });
      return regists;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} saleDeleted`;
  }

  update(id: number, updateSaleDeletedDto: UpdateSaleDeletedDto) {
    return `This action updates a #${id} saleDeleted`;
  }

  async removeAll() {
    try {
      const regists = await this.prisma.ventaEliminada.deleteMany({});
      return regists;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} saleDeleted`;
  }
}
