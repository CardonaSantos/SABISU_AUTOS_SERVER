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
          iPInternet: createClientDto.iPInternet,
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
          iPInternet: true,
          actualizadoEn: true,
          _count: {
            select: {
              compras: true,
            },
          },
        },
        orderBy: {
          creadoEn: 'desc',
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

  async findCustomersToWarranty() {
    try {
      const customers = await this.prisma.cliente.findMany({
        orderBy: {
          creadoEn: 'desc',
        },
      });

      return customers;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al encontrar customers');
    }
  }

  findAll() {
    return `This action returns all client`;
  }

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  async update(id: number, updateClientDto: UpdateClientDto) {
    try {
      console.log('La data llegando es: ', updateClientDto);

      const userUpdated = await this.prisma.cliente.update({
        where: {
          id: id,
        },
        data: {
          nombre: updateClientDto.nombre,
          telefono: updateClientDto.telefono,
          direccion: updateClientDto.direccion,
          dpi: updateClientDto.dpi,
          iPInternet: updateClientDto.iPInternet,
        },
      });

      console.log('user actualizado', userUpdated);

      return userUpdated;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al editar cliente');
    }
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

  async remove(id: number) {
    try {
      const userToDelete = await this.prisma.cliente.delete({
        where: {
          id,
        },
      });
      return userToDelete;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al intentar eliminar el cliente');
    }
  }

  async getClientToCredit() {
    try {
      const customers = await this.prisma.cliente.findMany({
        select: {
          id: true,
          nombre: true,
          telefono: true,
          dpi: true,
          creadoEn: true,
        },
        orderBy: {
          creadoEn: 'desc',
        },
      });
      return customers;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al conseguir customers');
    }
  }
}
