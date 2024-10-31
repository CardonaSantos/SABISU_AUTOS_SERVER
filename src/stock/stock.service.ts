import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateStockDto, StockEntryDTO } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEntregaStockDto } from 'src/entrega-stock/dto/create-entrega-stock.dto';
import { AjusteStockService } from 'src/ajuste-stock/ajuste-stock.service';
import { DeleteStockDto } from './dto/delete-stock.dto';
@Injectable()
export class StockService {
  //
  constructor(
    private readonly prisma: PrismaService,
    private readonly ajusteStock: AjusteStockService,
  ) {}

  async create(createStockDto: StockEntryDTO) {
    try {
      const { proveedorId, stockEntries, sucursalId, recibidoPorId } =
        createStockDto;

      console.log('Los otros ids son: ', {
        proveedorId,
        stockEntries,
        sucursalId,
        recibidoPorId,
      });

      // Calcular el costo total de la entrega sumando los productos
      const costoStockEntrega = stockEntries.reduce(
        (total, entry) => total + entry.cantidad * entry.precioCosto,
        0,
      );

      // Crear el registro de EntregaStock
      const newRegistDeliveryStock = await this.prisma.entregaStock.create({
        data: {
          proveedorId: proveedorId,
          montoTotal: costoStockEntrega,
          // Agregamos el usuario que recibe si está disponible
          recibidoPorId: recibidoPorId,
          sucursalId: sucursalId,
        },
      });

      console.log('El nuevo registro de entrega es: ', newRegistDeliveryStock);

      // Crear registros de Stock asociados a la entrega
      for (const entry of stockEntries) {
        const registroStock = await this.prisma.stock.create({
          data: {
            productoId: entry.productoId,
            cantidad: entry.cantidad,
            costoTotal: entry.precioCosto * entry.cantidad,
            fechaIngreso: entry.fechaIngreso,
            fechaVencimiento: entry.fechaVencimiento,
            precioCosto: entry.precioCosto,
            entregaStockId: newRegistDeliveryStock.id, // Asociar con la entrega
            sucursalId: sucursalId,
          },
        });

        console.log('El registro de stock es: ', registroStock);
      }

      console.log('Entrega y stock registrados correctamente.');
      return newRegistDeliveryStock;
    } catch (error) {
      console.error('Error al crear la entrega de stock:', error);
      throw new InternalServerErrorException(
        'Error al crear la entrega de stock',
      );
    }
  }

  async findAll() {
    try {
      const stocks = await this.prisma.stock.findMany({});
      return stocks;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al obtener los stocks');
    }
  }

  async findOne(id: number) {
    try {
      const stock = await this.prisma.stock.findUnique({
        where: { id },
      });
      if (!stock) {
        throw new NotFoundException(`Stock con ID ${id} no encontrado`);
      }
      return stock;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al encontrar el stock');
    }
  }

  async findOneStock(id: number) {
    try {
      const stock = await this.prisma.stock.findUnique({
        where: { id },
        include: {
          producto: {
            select: {
              nombre: true,
              id: true,
            },
          },
        },
      });
      if (!stock) {
        throw new NotFoundException(`Stock con ID ${id} no encontrado`);
      }
      return stock;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al encontrar el stock');
    }
  }

  // async deleteOneStock(dto: DeleteStockDto) {
  //   try {
  //     // Obtener los datos del stock antes de eliminarlo
  //     const stockToDelete = await this.prisma.stock.findUnique({
  //       where: {
  //         id: dto.stockId,
  //       },
  //       include: {
  //         producto: true,
  //         sucursal: true,
  //       },
  //     });

  //     if (!stockToDelete) {
  //       throw new BadRequestException('Stock no encontrado');
  //     }

  //     // Eliminar el stock
  //     await this.prisma.stock.delete({
  //       where: {
  //         id: dto.stockId,
  //       },
  //     });

  //     // Crear el registro en EliminacionStock
  //     const registroEliminacionStock =
  //       await this.prisma.eliminacionStock.create({
  //         data: {
  //           stockId: dto.stockId,
  //           productoId: dto.productoId,
  //           sucursalId: dto.sucursalId,
  //           usuarioId: dto.usuarioId,
  //           fechaHora: new Date(),
  //           motivo: dto.motivo || 'Sin motivo especificado',
  //         },
  //       });

  //     console.log('El nuevo registro es: ', registroEliminacionStock);

  //     return registroEliminacionStock;
  //   } catch (error) {
  //     console.error(error);
  //     throw new BadRequestException(
  //       'Error al eliminar el stock y registrar la eliminación',
  //     );
  //   }
  // }

  async deleteOneStock(dto: DeleteStockDto) {
    try {
      // Obtener el stock antes de eliminarlo
      const stockToDelete = await this.prisma.stock.findUnique({
        where: { id: dto.stockId },
      });

      if (!stockToDelete) {
        throw new BadRequestException('Stock no encontrado');
      }

      // Crear el registro en EliminacionStock
      const registroEliminacionStock =
        await this.prisma.eliminacionStock.create({
          data: {
            // stockId: dto.stockId,
            productoId: dto.productoId,
            sucursalId: dto.sucursalId,
            usuarioId: dto.usuarioId,
            fechaHora: new Date(),
            motivo: dto.motivo || 'Sin motivo especificado',
          },
        });

      // Eliminar el stock
      await this.prisma.stock.delete({
        where: { id: dto.stockId },
      });

      return registroEliminacionStock;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Error al eliminar el stock y registrar la eliminación',
      );
    }
  }

  async update(id: number, updateStockDto: UpdateStockDto) {
    try {
      const stock = await this.prisma.stock.update({
        where: { id },
        data: updateStockDto,
      });
      if (!stock) {
        throw new NotFoundException(`Stock con ID ${id} no encontrado`);
      }
      return stock;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al actualizar el stock');
    }
  }

  async removeAll() {
    try {
      const stocks = await this.prisma.stock.deleteMany({});
      return stocks;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al eliminar los stocks');
    }
  }

  async remove(id: number) {
    try {
      const stock = await this.prisma.stock.delete({
        where: { id },
      });
      if (!stock) {
        throw new NotFoundException(`Stock con ID ${id} no encontrado`);
      }
      return stock;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al eliminar el stock');
    }
  }

  async deleteStock(idStock: number, userID: number) {
    try {
      const stockToDelete = await this.prisma.stock.findUnique({
        where: {
          id: idStock,
        },
      });

      if (!stockToDelete) {
        throw new BadRequestException('Error al encontrar stock para eliminar');
      }

      await this.prisma.stock.delete({
        where: {
          id: stockToDelete.id,
        },
      });

      console.log('El stock a sido eliminado');

      return stockToDelete;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al eliminar stock ');
    }
  }
}
