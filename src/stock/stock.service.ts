import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateStockDto, StockEntryDTO } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEntregaStockDto } from 'src/entrega-stock/dto/create-entrega-stock.dto';
@Injectable()
export class StockService {
  //
  constructor(private readonly prisma: PrismaService) {}

  async create(createStockDto: StockEntryDTO) {
    try {
      const { proveedorId, stockEntries } = createStockDto;

      // Calcular el costo total de la entrega sumando los productos
      const costoStockEntrega = stockEntries.reduce(
        (total, entry) => total + entry.cantidad * entry.precioCosto,
        0,
      );

      // Crear el registro de EntregaStock
      const newRegistDeliveryStock = await this.prisma.entregaStock.create({
        data: {
          proveedorId,
          montoTotal: costoStockEntrega,
          // Agregamos el usuario que recibe si está disponible
          recibidoPorId: createStockDto.recibidoPorId,
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
}
