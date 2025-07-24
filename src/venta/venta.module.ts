import { Module } from '@nestjs/common';
import { VentaService } from './venta.service';
import { VentaController } from './venta.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientRemoveService } from 'src/client-remove/client-remove.service';
import { ClientService } from 'src/client/client.service';
import { NotificationService } from 'src/notification/notification.service';
import { WebsocketGateway } from 'src/web-sockets/websocket.gateway';
import { HistorialStockTrackerService } from 'src/historial-stock-tracker/historial-stock-tracker.service';

@Module({
  controllers: [VentaController],
  providers: [
    VentaService,
    PrismaService,
    ClientService,
    NotificationService,
    WebsocketGateway,
    HistorialStockTrackerService,
  ],
})
export class VentaModule {}
