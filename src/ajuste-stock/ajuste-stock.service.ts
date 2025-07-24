import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAjusteStockDto } from './dto/create-ajuste-stock.dto';
import { UpdateAjusteStockDto } from './dto/update-ajuste-stock.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TipoAjuste } from '@prisma/client';
import { HistorialStockTrackerService } from 'src/historial-stock-tracker/historial-stock-tracker.service';

@Injectable()
export class AjusteStockService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tracker: HistorialStockTrackerService,
  ) {}

  create(createAjusteStockDto: CreateAjusteStockDto) {
    return 'This action adds a new ajusteStock';
  }

  findAll() {
    return `This action returns all ajusteStock`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ajusteStock`;
  }

  async update(id: number, updateAjusteStockDto: UpdateAjusteStockDto) {
    try {
      console.log('El dto de ajuste es: ', updateAjusteStockDto);

      const stockToUpdate = await this.prisma.stock.findUnique({
        where: { id },
      });
      if (!stockToUpdate) {
        throw new InternalServerErrorException('Stock no encontrado');
      }

      const cantidadAnterior = stockToUpdate.cantidad;
      const cantidadAjustada = updateAjusteStockDto.cantidadAjustada;

      const stockUpdated = await this.prisma.stock.update({
        where: { id },
        data: {
          cantidad: cantidadAjustada,
          costoTotal: updateAjusteStockDto.costoTotal,
          fechaIngreso: new Date(updateAjusteStockDto.fechaIngreso),
          fechaVencimiento: updateAjusteStockDto.fechaVencimiento
            ? new Date(updateAjusteStockDto.fechaVencimiento)
            : null,
        },
      });

      const ajusteStock = await this.prisma.ajusteStock.create({
        data: {
          productoId: updateAjusteStockDto.productoId,
          stockId: stockUpdated.id,
          cantidadAjustada,
          tipoAjuste:
            cantidadAjustada > cantidadAnterior
              ? 'INCREMENTO'
              : cantidadAjustada < cantidadAnterior
                ? 'DECREMENTO'
                : 'CORRECCION',
          fechaHora: new Date(),
          usuarioId: updateAjusteStockDto.usuarioId,
          descripcion:
            updateAjusteStockDto.descripcion || 'Ajuste sin descripción',
        },
      });
      console.log('La cantidad anterio es: ', cantidadAnterior);
      console.log('La cantidad cantidadAjustada es: ', cantidadAjustada);

      await this.tracker.trackerAjusteStock(
        this.prisma,
        updateAjusteStockDto.productoId,
        stockToUpdate.sucursalId,
        updateAjusteStockDto.usuarioId,
        cantidadAnterior,
        cantidadAjustada,
        ajusteStock.id,
        updateAjusteStockDto.descripcion,
      );

      return {
        message: 'Stock actualizado y registro de ajuste creado correctamente',
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Error al actualizar el stock y registrar el ajuste',
      );
    }
  }

  remove(id: number) {
    return `This action removes a #${id} ajusteStock`;
  }
}
