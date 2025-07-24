import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateUtilityDto } from './dto/create-utility.dto';
import { UpdateUtilityDto } from './dto/update-utility.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { GenerateStockDto } from './dto/generate-stock.dto';
import { EntregaStockData } from './utils';

@Injectable()
export class UtilitiesService {
  private readonly logger = new Logger(UtilitiesService.name);
  constructor(private readonly prisma: PrismaService) {}

  async generateStockFromRequisicion(
    tx: Prisma.TransactionClient,
    dtos: GenerateStockDto[],
    entregaStockData?: EntregaStockData,
  ) {
    console.log('El dto entranod a generar el stock es: ', dtos);

    let entregaStock;

    if (entregaStockData) {
      entregaStock = await tx.entregaStock.create({
        data: {
          proveedorId: entregaStockData.proveedorId,
          montoTotal: entregaStockData.montoTotal,
          fechaEntrega: entregaStockData.fechaEntrega ?? new Date(),
          recibidoPorId: entregaStockData.recibidoPorId,
          sucursalId: entregaStockData.sucursalId,
        },
      });
    }

    const newStocksCreated = await Promise.all(
      dtos.map((prod) =>
        tx.stock.create({
          data: {
            cantidad: prod.cantidad,
            costoTotal: prod.costoTotal,
            fechaIngreso: prod.fechaIngreso,
            fechaVencimiento: prod?.fechaExpiracion,
            precioCosto: prod.precioCosto,
            cantidadInicial: prod.cantidad,
            sucursal: { connect: { id: prod.sucursalId } },
            producto: { connect: { id: prod.productoId } },
            entregaStock: entregaStock
              ? { connect: { id: entregaStock.id } }
              : undefined,
          },
        }),
      ),
    );

    if (!newStocksCreated || newStocksCreated.length === 0) {
      throw new InternalServerErrorException({
        message: 'No se pudieron registrar los stocks',
      });
    }

    this.logger.debug('El nuevo registro de stock es: ', newStocksCreated);
    return { newStocksCreated, entregaStock }; // Retorna ambos registros
  }
}
