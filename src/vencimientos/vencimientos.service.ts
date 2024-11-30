import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateVencimientoDto } from './dto/create-vencimiento.dto';
import { UpdateVencimientoDto } from './dto/update-vencimiento.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationService } from 'src/notification/notification.service';

//formato UTC
const formatFecha = (fecha: string | Date): string => {
  const opciones: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC', // Usamos UTC para mantener la consistencia
  };
  return new Date(fecha).toLocaleDateString('es-MX', opciones);
};

@Injectable()
export class VencimientosService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly notificationService: NotificationService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  handleCronVencimientos() {
    this.verificarYCrearVencimientos();
  }

  async verificarYCrearVencimientos() {
    console.log('EJECUTANDO TAREA');

    try {
      const hoy = new Date();
      hoy.setUTCHours(0, 0, 0, 0);

      const fechaLimite = new Date(hoy);
      fechaLimite.setDate(hoy.getDate() + 10);
      fechaLimite.setUTCHours(23, 59, 59, 999);

      // Obtener los stocks que vencen dentro de los próximos 10 días
      const proximosVencimientos = await this.prisma.stock.findMany({
        where: {
          fechaVencimiento: {
            gte: hoy,
            lte: fechaLimite,
          },
        },
      });

      console.log('Los próximos vencimientos son:', proximosVencimientos);

      const admins = await this.prisma.usuario.findMany({
        where: { rol: 'ADMIN' },
      });
      console.log('Los admins son: ', admins);

      for (const stock of proximosVencimientos) {
        // Verificar si ya existe un vencimiento para este stock
        const vencimientoExistente = await this.prisma.vencimiento.findFirst({
          where: { stockId: stock.id },
        });

        //SINO HAY UN REGISTRO DE VENCIMINTO, TENEMOS QUE HACER UNO
        if (!vencimientoExistente) {
          const producto = await this.prisma.producto.findUnique({
            where: { id: stock.productoId },
          });
          if (!producto) continue;

          const registroVencimiento = await this.prisma.vencimiento.create({
            data: {
              fechaVencimiento: stock.fechaVencimiento,
              descripcion: `El producto ${producto.nombre} tiene una instancia de Stock que vence el día ${formatFecha(stock.fechaVencimiento)}.`,

              stockId: stock.id,
              estado: 'PENDIENTE',
            },
          });
          console.log('Vencimiento creado:', registroVencimiento);

          for (const admin of admins) {
            const notificationExist = await this.prisma.notificacion.findFirst({
              where: {
                referenciaId: stock.id,
                AND: {
                  notificacionesUsuarios: {
                    some: {
                      usuarioId: admin.id,
                    },
                  },
                },
              },
            });

            if (!notificationExist) {
              console.log('Creando notificación para el admin:', admin.id);

              await this.notificationService.createOneNotification(
                // `El producto ${producto.nombre} tiene una instancia de Stock que vencerá el ${stock.fechaVencimiento}`,
                `El producto ${producto.nombre} tiene una instancia de Stock que vencerá el ${formatFecha(stock.fechaVencimiento)}`,

                null,
                admin.id,
                'VENCIMIENTO',
                stock.id,
              );
            } else {
              console.log('La notificación ya existe para el stock:', stock.id);
            }
          }
        } else {
          console.log(
            'El vencimiento ya existe para el stock y por lo tanto la notificación:',
            stock.id,
          );
        }
      }
    } catch (error) {
      console.error('Error al verificar vencimientos:', error);
    }
  }

  create(createVencimientoDto: CreateVencimientoDto) {
    return 'This action adds a new vencimiento';
  }

  async findAll() {
    try {
      const registrosVencimiento = await this.prisma.vencimiento.findMany({
        orderBy: {
          fechaCreacion: 'desc',
        },
        include: {
          stock: {
            select: {
              sucursal: {
                select: {
                  id: true,
                  nombre: true,
                },
              },
              producto: {
                select: {
                  id: true,
                  nombre: true,
                  codigoProducto: true,
                },
              },
            },
          },
        },
      });
      return registrosVencimiento;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al conseguir registros');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} vencimiento`;
  }

  async update(id: number, updateVencimientoDto: UpdateVencimientoDto) {
    try {
      const vencimientoActualizado = await this.prisma.vencimiento.update({
        where: {
          id: id,
        },
        data: {
          estado: 'RESUELTO',
        },
      });
      return vencimientoActualizado;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al actualizar registro');
    }
  }

  async removeAll() {
    try {
      const regists = await this.prisma.vencimiento.deleteMany({});
      return regists;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al eliminar registros');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} vencimiento`;
  }
}
