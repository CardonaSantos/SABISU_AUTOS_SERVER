import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePriceRequestDto } from './dto/create-price-request.dto';
import { UpdatePriceRequestDto } from './dto/update-price-request.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class PriceRequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}
  //
  async create(createPriceRequestDto: CreatePriceRequestDto) {
    try {
      const nuevaSolicitud = await this.prisma.solicitudPrecio.create({
        data: {
          precioSolicitado: createPriceRequestDto.precioSolicitado,
          aprobadoPorId: createPriceRequestDto.aprobadoPorId,
          productoId: createPriceRequestDto.productoId,
          estado: 'PENDIENTE',
          solicitadoPorId: createPriceRequestDto.solicitadoPorId,
        },
      });

      const admins = await this.prisma.usuario.findMany({
        where: { rol: 'ADMIN' },
      });

      const productoDetalles = await this.prisma.producto.findUnique({
        where: { id: nuevaSolicitud.productoId },
      });

      const user = await this.prisma.usuario.findUnique({
        where: { id: nuevaSolicitud.solicitadoPorId },
      });

      // Extraemos los IDs de los administradores para pasarlos al servicio de notificación
      const adminIds = admins.map((admin) => admin.id);

      await this.notificationService.create(
        `El usuario ${user.nombre} ha solicitado un precio de Q${nuevaSolicitud.precioSolicitado} especial para el producto "${productoDetalles.nombre}"`,
        nuevaSolicitud.solicitadoPorId,
        adminIds, // Pasamos todos los admin IDs aquí
        'SOLICITUD_PRECIO',
      );

      const solicitudDetalles = await this.prisma.solicitudPrecio.findUnique({
        where: {
          id: nuevaSolicitud.id,
        },
        include: {
          producto: true,
          solicitadoPor: {
            select: {
              nombre: true,
              id: true,
              rol: true,
              sucursal: {
                select: {
                  nombre: true,
                },
              },
            },
          },
        },
      });

      await Promise.all(
        admins.map((admin) =>
          this.notificationService.enviarNotificarSolicitud(
            solicitudDetalles,
            admin.id,
          ),
        ),
      );

      console.log('La nueva solicitud de precio es: ', nuevaSolicitud);
      return nuevaSolicitud;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error al crear registro y enviar notificaciones',
      );
    }
  }

  async aceptPriceRequest(idSolicitud: number, idUser: number) {
    try {
      console.log('idsolicitud: ', idSolicitud);
      console.log('idUser: ', idUser);

      // Buscar la solicitud en estado PENDIENTE
      const solicitudPendiente = await this.prisma.solicitudPrecio.findFirst({
        where: {
          id: idSolicitud,
          // estado: 'PENDIENTE',
        },
        include: { producto: true },
      });

      if (!solicitudPendiente) {
        throw new BadRequestException('Solicitud no encontrada o ya aprobada');
      }

      // Actualizar el estado de la solicitud a APROBADO
      const solicitudAprobada = await this.prisma.solicitudPrecio.update({
        where: { id: solicitudPendiente.id },
        data: {
          estado: 'APROBADO',
          fechaRespuesta: new Date(),
          aprobadoPorId: idUser,
        },
      });

      console.log('La solicitud aprobada es: ', solicitudAprobada);

      const productoId = solicitudPendiente.producto.id; // Recuperamos el productoId de la solicitud

      // Crear el nuevo precio asociado al producto
      const nuevoPrecio = await this.prisma.precioProducto.create({
        data: {
          estado: 'APROBADO',
          precio: solicitudAprobada.precioSolicitado,
          creadoPorId: idUser,
          productoId: productoId,
          tipo: 'CREADO_POR_SOLICITUD',
        },
      });

      console.log('Nuevo precio creado: ', nuevoPrecio);

      const producto = await this.prisma.producto.findUnique({
        where: {
          id: solicitudAprobada.productoId,
        },
      });

      // Crear la notificación para el usuario que hizo la solicitud
      const nuevaNotificacion =
        await this.notificationService.createOneNotification(
          `Un administrador ha aceptado tu solicitud de precio para el producto "${producto.nombre}"`,
          idUser,
          solicitudAprobada.solicitadoPorId,
          'OTRO',
        );
      console.log('Notificación de confirmación: ', nuevaNotificacion);

      // Borrar la solicitud procesada para que no vuelva a aparecer
      const solicitudBorrada = await this.prisma.solicitudPrecio.delete({
        where: { id: solicitudAprobada.id },
      });

      console.log('La solicitud borrada es: ', solicitudBorrada);
      // return { solicitudAprobada, nuevoPrecio, nuevaNotificacion };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error al procesar la solicitud de precio');
    }
  }

  async rejectRequesPrice(idSolicitud: number, idUser: number) {
    try {
      // Eliminar la solicitud
      const solicitudEliminada = await this.prisma.solicitudPrecio.delete({
        where: { id: idSolicitud },
      });

      const producto = await this.prisma.producto.findUnique({
        where: {
          id: solicitudEliminada.productoId,
        },
      });

      if (solicitudEliminada) {
        // Crear la notificación de rechazo
        const notificacionRechazo =
          await this.notificationService.createOneNotification(
            `Un administrador ha rechazado tu solicitud de precio para el producto "${producto.nombre}"`,
            idUser,
            solicitudEliminada.solicitadoPorId,
            'OTRO',
          );
        console.log('Notificación de rechazo creada:', notificacionRechazo);
      }

      return solicitudEliminada;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al rechazar la solicitud');
    }
  }

  async findAll() {
    try {
      const solicitudesDePrecio = await this.prisma.solicitudPrecio.findMany({
        include: {
          producto: true,
          solicitadoPor: {
            select: {
              nombre: true,
              id: true,
              rol: true,
              sucursal: {
                select: {
                  nombre: true,
                },
              },
            },
          },
        },
      });
      return solicitudesDePrecio;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Err');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} priceRequest`;
  }

  update(id: number, updatePriceRequestDto: UpdatePriceRequestDto) {
    return `This action updates a #${id} priceRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} priceRequest`;
  }

  async allremove() {
    return await this.prisma.solicitudPrecio.deleteMany({});
  }
}
