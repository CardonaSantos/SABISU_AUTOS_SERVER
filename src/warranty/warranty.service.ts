import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateWarrantyDto } from './dto/create-warranty.dto';
import { UpdateWarrantyDto } from './dto/update-warranty.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WarrantyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createWarrantyDto: CreateWarrantyDto) {
    try {
      const newWarrantyRegist = await this.prisma.garantia.create({
        data: {
          clienteId: createWarrantyDto.clienteId,
          productoId: createWarrantyDto.productoId,
          usuarioIdRecibe: createWarrantyDto.usuarioIdRecibe,
          comentario: createWarrantyDto.comentario,
          descripcionProblema: createWarrantyDto.descripcionProblema,
        },
      });

      console.log('El registro de garantía es: ', newWarrantyRegist);

      return newWarrantyRegist;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al crear registro de garantía');
    }
  }

  async findAll() {
    try {
      const warranties = await this.prisma.garantia.findMany({
        orderBy: {
          creadoEn: 'desc',
        },
      });

      return warranties;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al conseguir farantías');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} warranty`;
  }

  update(id: number, updateWarrantyDto: UpdateWarrantyDto) {
    return `This action updates a #${id} warranty`;
  }

  remove(id: number) {
    return `This action removes a #${id} warranty`;
  }

  async removeAll() {
    try {
      const warranties = await this.prisma.garantia.deleteMany({});
      return warranties;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al eliminar las garantías');
    }
  }
}
