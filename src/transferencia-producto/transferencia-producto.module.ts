import { Module } from '@nestjs/common';
import { TransferenciaProductoService } from './transferencia-producto.service';
import { TransferenciaProductoController } from './transferencia-producto.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [TransferenciaProductoController],
  providers: [TransferenciaProductoService, PrismaService],
})
export class TransferenciaProductoModule {}
