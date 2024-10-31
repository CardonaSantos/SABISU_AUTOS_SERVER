import { Module } from '@nestjs/common';
import { VentaService } from './venta.service';
import { VentaController } from './venta.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientRemoveService } from 'src/client-remove/client-remove.service';
import { ClientService } from 'src/client/client.service';

@Module({
  controllers: [VentaController],
  providers: [VentaService, PrismaService, ClientService],
})
export class VentaModule {}
