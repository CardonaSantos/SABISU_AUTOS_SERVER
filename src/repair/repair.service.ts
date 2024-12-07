import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateRepairDto } from './dto/create-repair.dto';
import { UpdateRepairDto } from './dto/update-repair.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { updateRepair } from './dto/updateRepair.dto';
import { closeRepairRegist } from './dto/close-regist-repair.dto';

@Injectable()
export class RepairService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRepairDto: CreateRepairDto) {
    try {
      console.log('Los datosson: ', createRepairDto);

      const rapirRegist = await this.prisma.reparacion.create({
        data: {
          clienteId: createRepairDto.clienteId,
          productoId: createRepairDto.productoId || null,
          productoExterno: createRepairDto.productoExterno,
          problemas: createRepairDto.problemas,
          observaciones: createRepairDto.observaciones,
          sucursalId: createRepairDto.sucursalId,
          usuarioId: createRepairDto.usuarioId,
          estado: 'RECIBIDO',
        },
      });
      return rapirRegist;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al registrar reparación');
    }
  }

  async findAll() {
    try {
      const regists = await this.prisma.reparacion.findMany({
        orderBy: {
          creadoEn: 'desc',
        },
        include: {
          cliente: {
            select: {
              id: true,
              nombre: true,
              telefono: true,
              dpi: true,
              direccion: true,
            },
          },
          usuario: {
            select: {
              id: true,
              nombre: true,
              rol: true,
            },
          },
          producto: {
            select: {
              id: true,
              nombre: true,
              codigoProducto: true,
              descripcion: true,
            },
          },
          sucursal: {
            select: {
              id: true,
              nombre: true,
              direccion: true,
            },
          },
          registros: {
            select: {
              id: true,
              estado: true,
              accionesRealizadas: true,
              comentarioFinal: true,
              fechaRegistro: true,
              montoPagado: true,
              usuario: {
                select: {
                  id: true,
                  nombre: true,
                  rol: true,
                },
              },
            },
          },
        },
      });
      return regists;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al conseguir registros');
    }
  }

  async findOneRepairToPDF(id: number) {
    try {
      const regists = await this.prisma.reparacion.findUnique({
        where: {
          id,
        },
        include: {
          cliente: {
            select: {
              id: true,
              nombre: true,
              telefono: true,
              dpi: true,
              direccion: true,
            },
          },
          usuario: {
            select: {
              id: true,
              nombre: true,
              rol: true,
            },
          },
          producto: {
            select: {
              id: true,
              nombre: true,
              codigoProducto: true,
              descripcion: true,
            },
          },
          sucursal: {
            select: {
              id: true,
              nombre: true,
              direccion: true,
            },
          },
          registros: true,
        },
      });
      return regists;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al conseguir registros');
    }
  }

  async findOneRepairToPdfFinal(id: number) {
    try {
      const regists = await this.prisma.reparacion.findUnique({
        where: {
          id,
        },
        include: {
          cliente: {
            select: {
              id: true,
              nombre: true,
              telefono: true,
              dpi: true,
              direccion: true,
            },
          },
          usuario: {
            select: {
              id: true,
              nombre: true,
              rol: true,
            },
          },
          producto: {
            select: {
              id: true,
              nombre: true,
              codigoProducto: true,
              descripcion: true,
            },
          },
          sucursal: {
            select: {
              id: true,
              nombre: true,
              direccion: true,
            },
          },
          registros: {
            include: {
              usuario: {
                select: {
                  id: true,
                  nombre: true,
                  rol: true,
                },
              },
            },
          },
        },
      });
      return regists;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al conseguir registros');
    }
  }

  async findRegistOpen() {
    try {
      const regists = await this.prisma.reparacion.findMany({
        where: {
          estado: {
            notIn: ['CANCELADO', 'FINALIZADO', 'NO_REPARABLE'],
          },
        },
        orderBy: {
          actualizadoEn: 'desc',
        },
        include: {
          cliente: {
            select: {
              id: true,
              nombre: true,
              telefono: true,
              dpi: true,
              direccion: true,
            },
          },
          usuario: {
            select: {
              id: true,
              nombre: true,
              rol: true,
            },
          },
          producto: {
            select: {
              id: true,
              nombre: true,
              codigoProducto: true,
              descripcion: true,
            },
          },
          sucursal: {
            select: {
              id: true,
              nombre: true,
              direccion: true,
            },
          },
          registros: true,
        },
      });
      return regists;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al conseguir registros');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} repair`;
  }

  async updateRepair(id: number, updateRepairDto: updateRepair) {
    try {
      const repairUpdated = await this.prisma.reparacion.update({
        where: {
          id,
        },
        data: {
          estado: updateRepairDto.estado,
          observaciones: updateRepairDto.observaciones,
          problemas: updateRepairDto.problemas,
        },
      });
      return repairUpdated;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al actualizar registro');
    }
  }

  async closeRepairRegist(id: number, closeRegistRepairDTO: closeRepairRegist) {
    try {
      console.log('los datos entrantes son: ', closeRegistRepairDTO);

      const nuevoRegistroReparacion =
        await this.prisma.registroReparacion.create({
          data: {
            estado: closeRegistRepairDTO.estado,
            comentarioFinal: closeRegistRepairDTO.comentarioFinal,
            accionesRealizadas: closeRegistRepairDTO.accionesRealizadas,
            reparacionId: id,
            usuarioId: closeRegistRepairDTO.usuarioId,
            montoPagado: Number(closeRegistRepairDTO.montoPagado),
          },
        });

      console.log(
        'El registro final de la reparacion es: ',
        nuevoRegistroReparacion,
      );

      const reparacionRegistro = await this.prisma.reparacion.update({
        where: {
          id,
        },
        data: {
          estado: closeRegistRepairDTO.estado,
        },
      });

      console.log('El primer registro de reparacion es: ', reparacionRegistro);

      console.log(
        'el registro de reparacion actualizado es: ',
        reparacionRegistro,
      );

      if (nuevoRegistroReparacion) {
        await this.prisma.sucursalSaldo.update({
          where: {
            sucursalId: closeRegistRepairDTO.sucursalId,
          },
          data: {
            saldoAcumulado: {
              increment: Number(closeRegistRepairDTO.montoPagado),
            },
            totalIngresos: {
              increment: Number(closeRegistRepairDTO.montoPagado),
            },
          },
        });
      }
      console.log('el registro de reparacion es: ', nuevoRegistroReparacion);

      return nuevoRegistroReparacion;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al cerrar el registro');
    }
  }

  update(id: number, updateRepairDto: UpdateRepairDto) {
    return `This action updates a #${id} repair`;
  }

  remove(id: number) {
    return `This action removes a #${id} repair`;
  }
}
