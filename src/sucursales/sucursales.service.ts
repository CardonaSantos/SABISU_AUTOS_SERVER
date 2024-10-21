import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateSucursaleDto } from './dto/create-sucursale.dto';
import { UpdateSucursaleDto } from './dto/update-sucursale.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SucursalesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSucursaleDto: CreateSucursaleDto) {
    console.log('los datos del sucursal son: ', createSucursaleDto);

    try {
      const newSucursal = await this.prisma.sucursal.create({
        data: {
          nombre: createSucursaleDto.nombre,
          tipoSucursal: createSucursaleDto.tipoSucursal, // Cambia esto a 'tipoSucursal'
          direccion: createSucursaleDto.direccion,
          telefono: createSucursaleDto.telefono,
        },
      });
      return newSucursal;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('error');
    }
  }

  async findAll() {
    try {
      const sucursales = await this.prisma.sucursal.findMany({
        select: {
          nombre: true,
          id: true,
        },
      });
      if (!sucursales) {
        throw new InternalServerErrorException('Error al encontrar sucursales');
      }
      return sucursales;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al encontrar sucursales');
    }
  }

  async findOneSucursal(id: number) {
    try {
      const sucursal = await this.prisma.sucursal.findUnique({
        where: {
          id: id,
        },
      });
      return sucursal;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al encontrar sucursal');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} sucursale`;
  }

  update(id: number, updateSucursaleDto: UpdateSucursaleDto) {
    return `This action updates a #${id} sucursale`;
  }

  remove(id: number) {
    return `This action removes a #${id} sucursale`;
  }
}
