import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProveedorService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createProveedorDto: CreateProveedorDto) {
    try {
      console.log('Datos recibidos:', createProveedorDto); // Asegúrate de que todos los campos llegan correctamente
      const proveedor = await this.prisma.proveedor.create({
        data: {
          nombre: createProveedorDto.nombre,
          correo: createProveedorDto.correo,
          telefono: createProveedorDto.telefono,
          activo: createProveedorDto.activo,
          direccion: createProveedorDto.direccion,
          razonSocial: createProveedorDto.razonSocial,
          rfc: createProveedorDto.rfc,
          nombreContacto: createProveedorDto.nombreContacto,
          telefonoContacto: createProveedorDto.telefonoContacto,
          emailContacto: createProveedorDto.emailContacto,
          pais: createProveedorDto.pais,
          ciudad: createProveedorDto.ciudad,
          codigoPostal: createProveedorDto.codigoPostal,
          latitud: parseFloat(createProveedorDto.latitud),
          longitud: parseFloat(createProveedorDto.longitud),
          notas: createProveedorDto.notas || null, // Opción por si es un campo opcional
        },
      });

      return proveedor;
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      throw new InternalServerErrorException('Error al crear proveedor');
    }
  }

  async findAll() {
    try {
      const proveedores = await this.prisma.proveedor.findMany({
        select: {
          id: true,
          nombre: true,
        },
      });
      return proveedores;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error al obtener los proveedores',
      );
    }
  }

  async findAllSimpleProveedor() {
    try {
      const proveedores = await this.prisma.proveedor.findMany({
        select: {
          id: true,
          nombre: true,
        },
      });
      return proveedores;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error al obtener los proveedores',
      );
    }
  }

  async findOne(id: number) {
    try {
      const proveedor = await this.prisma.proveedor.findUnique({
        where: { id },
      });
      if (!proveedor) {
        throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
      }
      return proveedor;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al encontrar el proveedor');
    }
  }

  async update(id: number, updateProveedorDto: UpdateProveedorDto) {
    // try {
    //   const proveedor = await this.prisma.proveedor.update({
    //     where: { id },
    //     data: updateProveedorDto,
    //   });
    //   if (!proveedor) {
    //     throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    //   }
    //   return proveedor;
    // } catch (error) {
    //   console.error(error);
    //   throw new InternalServerErrorException(
    //     'Error al actualizar el proveedor',
    //   );
    // }
  }

  async removeAll() {
    try {
      const proveedores = await this.prisma.proveedor.deleteMany({});
      return proveedores;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error al eliminar los proveedores',
      );
    }
  }

  async remove(id: number) {
    try {
      const proveedor = await this.prisma.proveedor.delete({
        where: { id },
      });
      if (!proveedor) {
        throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
      }
      return proveedor;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al eliminar el proveedor');
    }
  }
}
