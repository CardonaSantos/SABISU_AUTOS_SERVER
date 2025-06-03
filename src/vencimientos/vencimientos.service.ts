import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateVencimientoDto } from './dto/create-vencimiento.dto';
import { UpdateVencimientoDto } from './dto/update-vencimiento.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificationService } from 'src/notification/notification.service';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import 'dayjs/locale/es-mx';

dayjs.extend(utc);
dayjs.locale('es-mx');
dayjs.extend(timezone);

//formato UTC
// Función formatFecha corregida:
const formatFecha = (fecha: Date): string =>
  dayjs(fecha)
    .tz('America/Guatemala', true) // <-- Tercer parámetro es el booleano
    .locale('es')
    .format('D [de] MMMM [de] YYYY');

@Injectable()
export class VencimientosService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly notificationService: NotificationService,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS, {
    name: 'vencimientos.midnightGuate',
    timeZone: 'America/Guatemala',
  })
  async handleCronVencimientos() {
    await this.procesarVencimientos();
  }

  private async procesarVencimientos() {
    const hoy = dayjs().tz('America/Guatemala').startOf('day');
    const limite = hoy.add(15, 'day').endOf('day');

    console.log('🔍 Buscando vencimientos entre:', {
      desde: dayjs(hoy.toISOString()).format('DD MM YYYY'),
      hasta: dayjs(limite.toISOString()).format('DD MM YYYY'),
    });

    const stocks = await this.prisma.stock.findMany({
      where: {
        fechaVencimiento: {
          gte: hoy.toDate(),
          lte: limite.toDate(),
        },
      },
    });
    const admins = await this.prisma.usuario.findMany({
      where: { rol: 'ADMIN' },
    });

    for (const stock of stocks) {
      await this.procesarStock(stock, admins, hoy);
    }
  }

  private async procesarStock(stock, admins, hoy) {
    const ya = await this.prisma.vencimiento.findFirst({
      where: { stockId: stock.id },
    });
    if (ya) return;

    const producto = await this.prisma.producto.findUnique({
      where: { id: stock.productoId },
    });
    if (!producto) return;

    // const localExp = dayjs
    //   .tz(stock.fechaVencimiento, 'America/Guatemala')
    //   .startOf('day');
    // Dentro de procesarStock:
    const localExp = dayjs(stock.fechaVencimiento)
      .tz('America/Guatemala', true) // <-- Usar booleano directamente
      .startOf('day');

    const fechaCruda = new Date(stock.fechaVencimiento);
    const fechaSinFormato = stock.fechaVencimiento;

    console.log('la fecha cruda es: ', fechaCruda);
    console.log('la fechaSinFormatoa es: ', fechaSinFormato);

    console.log(
      'La fecha que vence es: ',
      dayjs(localExp).format('DD MM YYYY'),
    );

    const diasFaltan = localExp.diff(hoy, 'day');

    const formattedDate = localExp
      .locale('es-mx')
      .format('D [de] MMMM [de] YYYY');

    const venc = await this.prisma.vencimiento.create({
      data: {
        fechaVencimiento: stock.fechaVencimiento,
        descripcion: `El producto ${producto.nombre} vence en ${diasFaltan} días (el ${formattedDate}).`,
        stockId: stock.id,
        estado: 'PENDIENTE',
      },
    });
    console.log('Vencimiento creado:', venc.id);

    await Promise.all(
      admins.map((adm) => this.notificarAdmin(adm.id, stock, producto)),
    );
  }

  private async notificarAdmin(adminId: number, stock, producto) {
    const existe = await this.prisma.notificacion.findFirst({
      where: {
        referenciaId: stock.id,
        notificacionesUsuarios: { some: { usuarioId: adminId } },
      },
    });
    if (existe) return;

    await this.notificationService.createOneNotification(
      `El producto ${producto.nombre} vence el ${formatFecha(stock.fechaVencimiento)}`,
      null,
      adminId,
      'VENCIMIENTO',
      stock.id,
    );
    console.log(`Notificación enviada a admin ${adminId}`);
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
        where: {
          stock: {
            isNot: null,
          },
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
