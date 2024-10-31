import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto) {
    try {
      const client = await this.prisma.cliente.create({
        data: {
          nombre: createClientDto.nombre,
          dpi: createClientDto.dpi,
          telefono: createClientDto.telefono,
          direccion: createClientDto.direccion,
        },
      });

      if (!client) {
        throw new BadRequestException('Error al crear cliente');
      }

      return client;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error en el servidor');
    }
  }

  async Customers() {
    try {
      const clientes = await this.prisma.cliente.findMany({
        select: {
          id: true,
          nombre: true,
          telefono: true,
          dpi: true,
          direccion: true,
          actualizadoEn: true,
        },
      });

      if (!clientes) {
        throw new InternalServerErrorException('Error');
      }

      return clientes;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al encontrar los clientes');
    }
  }

  findAll() {
    return `This action returns all client`;
  }

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
