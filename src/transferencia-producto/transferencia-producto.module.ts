import { Module } from '@nestjs/common';
import { TransferenciaProductoService } from './transferencia-producto.service';
import { TransferenciaProductoController } from './transferencia-producto.controller';

@Module({
  controllers: [TransferenciaProductoController],
  providers: [TransferenciaProductoService],
})
export class TransferenciaProductoModule {}
