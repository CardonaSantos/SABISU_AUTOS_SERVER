import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateWarrantyDto } from './dto/create-warranty.dto';
import { UpdateWarrantyDto } from './dto/update-warranty.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegistroGarantiaDto } from './dto/create-regist-warranty.dto';

@Injectable()
export class WarrantyService {
  constructor(private readonly prisma: PrismaService) {}
  //CREAR REGISTRO INICIAL DE GARANTÍA PARA EL PDF
  async create(createWarrantyDto: CreateWarrantyDto) {
    try {
      const newWarrantyRegist = await this.prisma.garantia.create({
        data: {
          clienteId: createWarrantyDto.clienteId,
          productoId: createWarrantyDto.productoId,
          usuarioIdRecibe: createWarrantyDto.usuarioIdRecibe,
          comentario: createWarrantyDto.comentario,
          descripcionProblema: createWarrantyDto.descripcionProblema,
          proveedorId: createWarrantyDto.proveedorId || null,
          estado: createWarrantyDto.estado || 'RECIBIDO',
        },
      });

      console.log('El registro de garantía es: ', newWarrantyRegist);

      return newWarrantyRegist;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al crear registro de garantía');
    }
  }

  //CREAR REGISTRO FINAL DE GARANTÍA
  async createRegistWarranty(creatreRegistWarranty: RegistroGarantiaDto) {
    try {
      console.log('INFORMACION LLEGANDO DESDE EL FRONT', creatreRegistWarranty);

      const newRegistW = await this.prisma.registroGarantia.create({
        data: {
          garantiaId: creatreRegistWarranty.garantiaId,
          usuarioId: creatreRegistWarranty.usuarioId,
          estado: creatreRegistWarranty.estado,
          productoId: creatreRegistWarranty.productoId,
          conclusion: creatreRegistWarranty.conclusion,
          accionesRealizadas: creatreRegistWarranty.accionesRealizadas,
          proveedorId: creatreRegistWarranty.proveedorId,
        },
      });

      if (!newRegistW) {
        throw new InternalServerErrorException(
          'Error al crear regitro de finalizacion de garantía',
        );
      }

      const warrantyRegist = await this.prisma.garantia.update({
        where: {
          id: creatreRegistWarranty.garantiaId,
        },
        data: {
          estado: 'ENTREGADO_CLIENTE',
        },
      });

      console.log('El registro de garantía ya finalizado es: ', warrantyRegist);

      return newRegistW;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error al crear registro final de garantía',
      );
    }
  }

  async getAllRegistWarranty() {
    try {
      const registsWarranties = await this.prisma.registroGarantia.findMany({
        orderBy: {
          fechaRegistro: 'desc',
        },
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
              sucursal: {
                select: {
                  id: true,
                  nombre: true,
                  direccion: true,
                },
              },
            },
          },
          garantia: {
            select: {
              id: true,
              fechaRecepcion: true,
              estado: true,
              cliente: {
                select: {
                  id: true,
                  nombre: true,
                  telefono: true,
                  direccion: true,
                  dpi: true,
                },
              },
            },
          },
        },
      });
      return registsWarranties;
    } catch (error) {
      console.error('Error al obtener registros de garantía:', error);
      throw new Error('Error al obtener registros de garantía.');
    }
  }

  async findAll() {
    try {
      const warranties = await this.prisma.garantia.findMany({
        where: {
          estado: {
            notIn: ['CERRADO', 'ENTREGADO_CLIENTE'],
          },
        },
        include: {
          cliente: {
            select: {
              id: true,
              nombre: true,
              telefono: true,
              direccion: true,
              dpi: true,
            },
          },
          proveedor: {
            select: {
              id: true,
              nombre: true,
              telefono: true,
              telefonoContacto: true,
            },
          },
          usuarioRecibe: {
            select: {
              id: true,
              nombre: true,
              rol: true,
              sucursal: {
                select: {
                  id: true,
                  nombre: true,
                },
              },
            },
          },
          producto: {
            select: {
              id: true,
              nombre: true,
              descripcion: true,
              codigoProducto: true,
            },
          },
        },
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

  async findOne(id: number) {
    try {
      const warranties = await this.prisma.garantia.findMany({
        where: {
          id,
        },
        include: {
          cliente: {
            select: {
              id: true,
              nombre: true,
              telefono: true,
              direccion: true,
              dpi: true,
            },
          },
          usuarioRecibe: {
            select: {
              id: true,
              nombre: true,
              rol: true,
              sucursal: {
                select: {
                  id: true,
                  nombre: true,
                  direccion: true,
                },
              },
            },
          },
          producto: {
            select: {
              id: true,
              nombre: true,
              descripcion: true,
              codigoProducto: true,
            },
          },
        },
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

  async update(id: number, updateWarrantyDto: UpdateWarrantyDto) {
    try {
      console.log('Los datos llegando al update warranty');

      const registToUpdate = await this.prisma.garantia.update({
        where: {
          id,
        },
        data: {
          comentario: updateWarrantyDto.comentario,
          descripcionProblema: updateWarrantyDto.descripcionProblema,
          estado: updateWarrantyDto.estado,
        },
      });

      console.log(registToUpdate);

      return registToUpdate;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al actualizar');
    }
  }

  async getOneWarrantyFinalForPdf(id: number) {
    try {
      const registsWarranties = await this.prisma.registroGarantia.findUnique({
        where: {
          id,
        },
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
              sucursal: {
                select: {
                  id: true,
                  nombre: true,
                  direccion: true,
                },
              },
            },
          },
          garantia: {
            //INFORMACION DE CUANDO SE RECIBIÓ LA GARANTÍA
            select: {
              id: true,
              fechaRecepcion: true,
              estado: true,
              cliente: {
                select: {
                  id: true,
                  nombre: true,
                  telefono: true,
                  direccion: true,
                  dpi: true,
                },
              },
            },
          },
        },
      });
      return registsWarranties;
    } catch (error) {
      console.error('Error al obtener registros de garantía:', error);
      throw new Error('Error al obtener registros de garantía.');
    }
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
