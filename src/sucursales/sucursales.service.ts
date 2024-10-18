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

  findAll() {
    return `This action returns all sucursales`;
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
