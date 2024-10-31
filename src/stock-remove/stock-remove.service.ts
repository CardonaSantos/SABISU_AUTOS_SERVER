import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateStockRemoveDto } from './dto/create-stock-remove.dto';
import { UpdateStockRemoveDto } from './dto/update-stock-remove.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StockRemoveService {
  constructor(private readonly prisma: PrismaService) {}

  create(createStockRemoveDto: CreateStockRemoveDto) {
    return 'This action adds a new stockRemove';
  }

  findAll() {
    return `This action returns all stockRemove`;
  }

  async find_remove_stock() {
    try {
      const regists = await this.prisma.eliminacionStock.findMany({
        include: {
          producto: {
            select: {
              id: true,
              nombre: true,
              descripcion: true,
              codigoProducto: true,
            },
          },
          usuario: {
            select: {
              id: true,
              nombre: true,
              rol: true,
            },
          },
          sucursal: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      });

      if (!regists) {
        throw new NotFoundException('No se pudieron encontrar los registros');
      }

      return regists;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error al conseguir los registros de stocks',
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} stockRemove`;
  }

  update(id: number, updateStockRemoveDto: UpdateStockRemoveDto) {
    return `This action updates a #${id} stockRemove`;
  }

  remove(id: number) {
    return `This action removes a #${id} stockRemove`;
  }
}
