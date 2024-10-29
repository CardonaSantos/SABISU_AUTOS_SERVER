import { Module } from '@nestjs/common';
import { SolicitudTransferenciaProductoService } from './solicitud-transferencia-producto.service';
import { SolicitudTransferenciaProductoController } from './solicitud-transferencia-producto.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransferenciaProductoService } from 'src/transferencia-producto/transferencia-producto.service';
import { WebsocketGateway } from 'src/web-sockets/websocket.gateway';
import { NotificationService } from 'src/notification/notification.service';

@Module({
  controllers: [SolicitudTransferenciaProductoController],
  providers: [
    SolicitudTransferenciaProductoService,
    PrismaService,
    TransferenciaProductoService,
    WebsocketGateway,
    NotificationService,
  ],
})
export class SolicitudTransferenciaProductoModule {}
