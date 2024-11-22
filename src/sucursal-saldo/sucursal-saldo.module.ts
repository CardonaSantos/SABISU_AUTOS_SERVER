import { Module } from '@nestjs/common';
import { SucursalSaldoService } from './sucursal-saldo.service';
import { SucursalSaldoController } from './sucursal-saldo.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SucursalSaldoController],
  providers: [SucursalSaldoService, PrismaService],
})
export class SucursalSaldoModule {}
