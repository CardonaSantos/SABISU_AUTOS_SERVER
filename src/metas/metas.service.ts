import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateMetaDto } from './dto/update-meta.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMetaUsuarioDto } from './dto/MetaUsuarioDTO.dto';
import { CreateMetaCobrosDto } from './dto/MetaCobrosDTO.dto';
import { error } from 'console';
import { CreateDepositoCobroDto } from './dto/DepositoCobroDTO.dto';

@Injectable()
export class MetasService {
  constructor(private readonly prisma: PrismaService) {}

  async createSellerGoal(createMetaDTO: CreateMetaUsuarioDto) {
    try {
      console.log('Datos recibidos:', createMetaDTO);

      const sucursal = await this.prisma.sucursal.findUnique({
        where: { id: createMetaDTO.sucursalId },
      });
      if (!sucursal) {
        throw new NotFoundException('Sucursal no encontrada');
      }

      // Validar que el usuario y la sucursal existan
      const usuario = await this.prisma.usuario.findUnique({
        where: { id: createMetaDTO.usuarioId },
      });

      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }

      // Crear la meta
      const newGoalToUser = await this.prisma.metaUsuario.create({
        data: {
          fechaFin: createMetaDTO.fechaFin,
          // fechaInicio: createMetaDTO.fechaInicio,
          montoMeta: createMetaDTO.montoMeta,
          numeroVentas: 0, // Inicializamos en 0
          sucursalId: createMetaDTO.sucursalId,
          usuarioId: createMetaDTO.usuarioId,
          tituloMeta: createMetaDTO.tituloMeta || null,
          estado: 'ABIERTO',
        },
      });

      console.log('La nueva meta es: ', newGoalToUser);
      return newGoalToUser;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'La meta ya existe para este usuario y sucursal',
        );
      }
      console.error(error);
      throw new BadRequestException('Error al crear la meta para el usuario');
    }
  }

  async createNewGoalCobros(createMetaCobro: CreateMetaCobrosDto) {
    try {
      console.log('Los datos son: ', createMetaCobro);

      // Validar que el usuario y la sucursal existan
      const usuario = await this.prisma.usuario.findUnique({
        where: { id: createMetaCobro.usuarioId },
      });
      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const sucursal = await this.prisma.sucursal.findUnique({
        where: { id: createMetaCobro.sucursalId },
      });
      if (!sucursal) {
        throw new NotFoundException('Sucursal no encontrada');
      }

      // Crear la meta para cobros
      const newMetaCobros = await this.prisma.metaCobros.create({
        data: {
          usuarioId: createMetaCobro.usuarioId,
          sucursalId: createMetaCobro.sucursalId,
          // fechaInicio: createMetaCobro.fechaInicio,
          fechaFin: createMetaCobro.fechaFin,
          montoMeta: createMetaCobro.montoMeta,
          montoActual: createMetaCobro.montoActual || 0, // Inicializar en 0 si no se proporciona
          numeroDepositos: createMetaCobro.numeroDepositos || 0, // Inicializar en 0 si no se proporciona
          tituloMeta: createMetaCobro.tituloMeta || null,
          estado: 'ABIERTO',
        },
      });

      console.log('El nuevo registro de meta para cobros es: ', newMetaCobros);
      return newMetaCobros;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Ya existe una meta para este usuario en esta sucursal con los mismos parámetros',
        );
      }
      console.error(error);
      throw new BadRequestException('Error al registrar meta para cobros');
    }
  }

  async findAllSellerGoal(idSucursal: number) {
    try {
      console.log('Metas de las tiendas');

      const regists = await this.prisma.metaUsuario.findMany({
        select: {
          id: true,
          cumplida: true,
          fechaCumplida: true,
          fechaFin: true,
          fechaInicio: true,
          montoActual: true,
          montoMeta: true,
          numeroVentas: true,
          sucursalId: true,
          tituloMeta: true,
          usuarioId: true,
          sucursal: {
            select: {
              id: true,
              nombre: true,
              telefono: true,
              direccion: true,
            },
          },
          usuario: {
            select: {
              id: true,
              nombre: true,
              correo: true,
              rol: true,
            },
          },
        },
      });

      if (!regists) {
        throw new BadRequestException('Error al encontrar registros de metas');
      }

      return regists;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al ejecutar servicio');
    }
  }

  async findAllCobrosMetas(idSucursal: number) {
    try {
      const regists = await this.prisma.metaCobros.findMany({
        where: {
          sucursalId: idSucursal,
        },
        include: {
          // sucursal: true,
          // usuario: true,
          DepositoCobro: true,
          sucursal: {
            select: {
              id: true,
              nombre: true,
              direccion: true,
              telefono: true,
              pbx: true,
            },
          },
          usuario: {
            select: {
              id: true,
              nombre: true,
              rol: true,
            },
          },
        },
      });
      if (!regists) {
        throw new BadRequestException(
          'Error al encontrar registros de metas cobro',
        );
      }
      return regists;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al ejecutar servicio');
    }
  }
  async createNewPaymentCobro(createDepositoDTO: CreateDepositoCobroDto) {
    try {
      const [newPayment, updatedMetaCobro] = await this.prisma.$transaction([
        // Crear el nuevo depósito
        this.prisma.depositoCobro.create({
          data: createDepositoDTO,
        }),
        // Actualizar el monto actual en la meta asociada
        this.prisma.metaCobros.update({
          where: {
            id: createDepositoDTO.metaCobroId,
          },
          data: {
            montoActual: {
              increment: createDepositoDTO.montoDepositado,
            },
          },
        }),
      ]);

      // Verificar si la meta ahora está cumplida y actualizar si es necesario
      if (
        updatedMetaCobro.montoActual >= updatedMetaCobro.montoMeta &&
        !updatedMetaCobro.cumplida
      ) {
        await this.prisma.metaCobros.update({
          where: {
            id: updatedMetaCobro.id,
          },
          data: {
            cumplida: true,
          },
        });
      }

      return newPayment;
    } catch (error) {
      console.error('Error al crear nuevo pago:', error);

      if (error.code === 'P2025') {
        throw new BadRequestException(
          'No se encontró la meta asociada al ID proporcionado.',
        );
      }

      throw new BadRequestException(
        'Error al registrar el nuevo pago. Verifique los datos e intente nuevamente.',
      );
    }
  }

  async deleteAll() {
    try {
      const metasTienda = await this.prisma.metaUsuario.deleteMany({});
      const metasCobros = await this.prisma.metaCobros.deleteMany({});
      return {
        metasCobros,
        metasTienda,
      };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al eliminar registros');
    }
  }

  async deleteAllMetasUsers() {
    try {
      const users = await this.prisma.usuario.findMany({
        select: {
          id: true,
          nombre: true,
          correo: true,
          sucursal: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      });
      return users;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al conseguir usuarios');
    }
  }

  async getMyGoalsAndMore(userId: number) {
    if (!userId || userId <= 0) {
      throw new BadRequestException(
        'El ID de usuario proporcionado no es válido',
      );
    }

    try {
      const metasCobros = await this.prisma.metaCobros.findMany({
        where: {
          usuarioId: userId,
        },
        include: {
          // sucursal: true,
          // usuario: true,
          DepositoCobro: true,
          sucursal: {
            select: {
              id: true,
              nombre: true,
              direccion: true,
              telefono: true,
              pbx: true,
            },
          },
          usuario: {
            select: {
              id: true,
              nombre: true,
              rol: true,
            },
          },
        },
      });

      const metasTienda = await this.prisma.metaUsuario.findMany({
        where: {
          usuarioId: userId,
        },
        select: {
          id: true,
          cumplida: true,
          fechaCumplida: true,
          fechaFin: true,
          fechaInicio: true,
          montoActual: true,
          montoMeta: true,
          numeroVentas: true,
          sucursalId: true,
          tituloMeta: true,
          usuarioId: true,
          sucursal: {
            select: {
              id: true,
              nombre: true,
              telefono: true,
              direccion: true,
            },
          },
          usuario: {
            select: {
              id: true,
              nombre: true,
              correo: true,
              rol: true,
            },
          },
        },
      });

      return {
        metasCobros,
        metasTienda,
      };
    } catch (error) {
      console.error('Error al conseguir metas del usuario:', error);
      throw new BadRequestException(
        'Ocurrió un error al obtener las metas del usuario',
      );
    }
  }

  async removeOneDepo(metaId: number, id: number) {
    try {
      // Transacción para garantizar consistencia
      const [depo, metaCobro] = await this.prisma.$transaction([
        this.prisma.depositoCobro.delete({
          where: {
            id: id,
          },
        }),

        this.prisma.metaCobros.update({
          where: {
            id: metaId,
          },
          data: {
            montoActual: {
              decrement:
                (
                  await this.prisma.depositoCobro.findUnique({
                    where: { id: id },
                  })
                )?.montoDepositado || 0, // Previene valores nulos o undefined
            },
          },
        }),
      ]);

      return {
        depo,
        metaCobro,
      };
    } catch (error) {
      console.error('Error al eliminar depósito y actualizar la meta:', error);

      // Manejo específico de errores de Prisma
      if (error.code === 'P2025') {
        throw new BadRequestException(
          'No se encontró el depósito o la meta asociada.',
        );
      }

      throw new BadRequestException(
        'Error al eliminar el depósito y actualizar la meta.',
      );
    }
  }

  findAll() {
    return `This action returns all metas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} meta`;
  }

  update(id: number, updateMetaDto: UpdateMetaDto) {
    return `This action updates a #${id} meta`;
  }

  remove(id: number) {
    return `This action removes a #${id} meta`;
  }
}
