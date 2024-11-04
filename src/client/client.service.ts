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
    console.log('La data entrando al client es: ', createClientDto);

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

      console.log('El cliente creado es: ', client);

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
          _count: {
            select: {
              compras: true,
            },
          },
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

  async removeAll() {
    try {
      const clientes = await this.prisma.cliente.deleteMany({});
      return clientes;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
