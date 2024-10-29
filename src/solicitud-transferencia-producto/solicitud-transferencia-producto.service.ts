import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateSolicitudTransferenciaProductoDto } from './dto/create-solicitud-transferencia-producto.dto';
import { UpdateSolicitudTransferenciaProductoDto } from './dto/update-solicitud-transferencia-producto.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransferenciaProductoService } from 'src/transferencia-producto/transferencia-producto.service';
import { NotificationService } from 'src/notification/notification.service';
import { WebsocketGateway } from 'src/web-sockets/websocket.gateway';
import { CreateTransferenciaProductoDto } from 'src/transferencia-producto/dto/create-transferencia-producto.dto';

@Injectable()
export class SolicitudTransferenciaProductoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly transferenciaProductoService: TransferenciaProductoService,
    private readonly notificationService: NotificationService,
    private readonly webSocketGateway: WebsocketGateway,
  ) {}

  async create(
    createSolicitudTransferenciaProductoDto: CreateSolicitudTransferenciaProductoDto,
  ) {
    try {
      const nuevaSolicitudTransferencia =
        await this.prisma.solicitudTransferenciaProducto.create({
          data: {
            cantidad: createSolicitudTransferenciaProductoDto.cantidad,
            estado: 'PENDIENTE',
            productoId: createSolicitudTransferenciaProductoDto.productoId,
            sucursalOrigenId:
              createSolicitudTransferenciaProductoDto.sucursalOrigenId,
            sucursalDestinoId:
              createSolicitudTransferenciaProductoDto.sucursalDestinoId,
            usuarioSolicitanteId:
              createSolicitudTransferenciaProductoDto.usuarioSolicitanteId,
          },
        });

      const admins = await this.prisma.usuario.findMany({
        where: { rol: 'ADMIN' },
      });

      const mensaje = `Nueva solicitud de transferencia creada por usuario ${createSolicitudTransferenciaProductoDto.usuarioSolicitanteId}`;
      const tipoNotificacion = 'SOLICITUD_TRANSFERENCIA';

      const solicitudTranferenciaDetalles =
        await this.prisma.solicitudTransferenciaProducto.findUnique({
          where: {
            id: nuevaSolicitudTransferencia.id,
          },
          include: {
            producto: {
              select: {
                nombre: true,
              },
            },
            sucursalOrigen: {
              select: {
                nombre: true,
              },
            },
            sucursalDestino: {
              select: {
                nombre: true,
              },
            },
            usuarioSolicitante: {
              select: {
                nombre: true,
                rol: true,
              },
            },
          },
        });

      // Crear la notificación en la base de datos y emitir a cada administrador
      await Promise.all(
        admins.map(async (admin) => {
          // Crear y emitir notificación
          await this.notificationService.create(
            mensaje,
            createSolicitudTransferenciaProductoDto.usuarioSolicitanteId,
            [admin.id],
            'TRANSFERENCIA',
            solicitudTranferenciaDetalles.id,
          );

          // Emitir la solicitud de transferencia directamente a cada admin conectado
          this.webSocketGateway.handleEnviarSolicitudTransferencia(
            solicitudTranferenciaDetalles,
            admin.id,
          );
        }),
      );

      return nuevaSolicitudTransferencia;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Error al crear la solicitud de transferencia',
      );
    }
  }

  async createTransferencia(idSolicitudTransferencia: number, userID: number) {
    try {
      // Encontrar la solicitud de transferencia
      const solicitudTransferencia =
        await this.prisma.solicitudTransferenciaProducto.findUnique({
          where: { id: idSolicitudTransferencia },
        });

      if (!solicitudTransferencia) {
        throw new Error('Solicitud de transferencia no encontrada');
      }

      // Extraer datos necesarios para la transferencia
      const dto: CreateTransferenciaProductoDto = {
        productoId: solicitudTransferencia.productoId,
        cantidad: solicitudTransferencia.cantidad,
        sucursalOrigenId: solicitudTransferencia.sucursalOrigenId,
        sucursalDestinoId: solicitudTransferencia.sucursalDestinoId,
        usuarioEncargadoId: userID,
      };

      // Ejecutar la transferencia
      const transferencia = await this.transferirProducto(dto);

      // Eliminar la solicitud de transferencia después de completar la transferencia
      await this.prisma.solicitudTransferenciaProducto.delete({
        where: { id: idSolicitudTransferencia },
      });

      return {
        message: 'Transferencia realizada y solicitud eliminada con éxito',
        transferencia,
      };
    } catch (error) {
      throw new Error(`Error al aceptar la transferencia: ${error.message}`);
    }
  }

  //=====================================================================>

  async transferirProducto(dto: CreateTransferenciaProductoDto) {
    const {
      productoId,
      cantidad,
      sucursalOrigenId,
      sucursalDestinoId,
      usuarioEncargadoId,
    } = dto;

    // Verificar que hay suficiente stock en la sucursal de origen sumando todos los registros disponibles
    const stockOrigenes = await this.prisma.stock.findMany({
      where: { productoId, sucursalId: sucursalOrigenId },
      orderBy: { fechaIngreso: 'asc' }, // Ordenar por fechaIngreso para aplicar FIFO
    });

    // Calcular la cantidad total disponible en la sucursal de origen
    const cantidadTotalStockOrigen = stockOrigenes.reduce(
      (total, stock) => total + stock.cantidad,
      0,
    );

    if (cantidadTotalStockOrigen < cantidad) {
      throw new Error('Stock insuficiente en la sucursal de origen');
    }

    let cantidadRestante = cantidad;

    // FIFO
    for (const stock of stockOrigenes) {
      if (cantidadRestante === 0) break;

      if (stock.cantidad <= cantidadRestante) {
        // Si el stock actual es menor o igual a la cantidad requerida, restar todo el stock
        await this.prisma.stock.update({
          where: { id: stock.id },
          data: { cantidad: 0 }, // Consumir todo este registro de stock
        });
        cantidadRestante -= stock.cantidad;
      } else {
        // Si el stock actual es mayor a la cantidad requerida, restar solo lo necesario
        await this.prisma.stock.update({
          where: { id: stock.id },
          data: { cantidad: stock.cantidad - cantidadRestante },
        });
        cantidadRestante = 0; // Ya no queda más cantidad por transferir
      }
    }

    // Buscar o crear el stock en la sucursal de destino
    const stockDestino = await this.prisma.stock.findFirst({
      where: { productoId, sucursalId: sucursalDestinoId },
    });

    if (stockDestino) {
      // Si ya existe el stock del producto en la sucursal destino, sumamos la cantidad
      await this.prisma.stock.update({
        where: { id: stockDestino.id },
        data: { cantidad: stockDestino.cantidad + cantidad },
      });
    } else {
      // Si no existe, creamos un nuevo registro de stock en la sucursal destino
      await this.prisma.stock.create({
        data: {
          productoId,
          sucursalId: sucursalDestinoId,
          cantidad,
          precioCosto: stockOrigenes[0].precioCosto, // Usar el precioCosto del primer stock FIFO
          costoTotal: stockOrigenes[0].precioCosto * cantidad,
          fechaIngreso: new Date(),
        },
      });
    }

    // Registrar la transferencia en la tabla TransferenciaProducto
    await this.prisma.transferenciaProducto.create({
      data: {
        productoId,
        cantidad,
        sucursalOrigenId,
        sucursalDestinoId,
        usuarioEncargadoId,
        fechaTransferencia: new Date(),
      },
    });

    return { message: 'Transferencia realizada con éxito' };
  }

  async findAll() {
    try {
      const solicitudesTransferencia =
        await this.prisma.solicitudTransferenciaProducto.findMany({
          include: {
            producto: {
              select: {
                nombre: true,
              },
            },
            sucursalOrigen: {
              select: {
                nombre: true,
              },
            },
            sucursalDestino: {
              select: {
                nombre: true,
              },
            },
            usuarioSolicitante: {
              select: {
                nombre: true,
                rol: true,
              },
            },
          },
        });

      return solicitudesTransferencia;
    } catch (error) {
      console.log(error);

      throw new InternalServerErrorException(
        'Error al encontrar las solicitudes de trasnferencia',
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} solicitudTransferenciaProducto`;
  }

  update(
    id: number,
    updateSolicitudTransferenciaProductoDto: UpdateSolicitudTransferenciaProductoDto,
  ) {
    return `This action updates a #${id} solicitudTransferenciaProducto`;
  }

  async removeAll() {
    return this.prisma.solicitudTransferenciaProducto.deleteMany({});
  }

  remove(id: number) {
    return `This action removes a #${id} solicitudTransferenciaProducto`;
  }
}
