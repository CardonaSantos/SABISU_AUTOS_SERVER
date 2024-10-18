import { Module } from '@nestjs/common';
import { VentaProductoService } from './venta-producto.service';
import { VentaProductoController } from './venta-producto.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [VentaProductoController],
  providers: [VentaProductoService, PrismaService],
})
export class VentaProductoModule {}
