import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateSucursalSaldoDto } from './dto/create-sucursal-saldo.dto';
import { UpdateSucursalSaldoDto } from './dto/update-sucursal-saldo.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SucursalSaldoService {
  constructor(private readonly prisma: PrismaService) {}

  create(createSucursalSaldoDto: CreateSucursalSaldoDto) {
    return 'This action adds a new sucursalSaldo';
  }

  async findAll() {}

  async findOne(sucursalId: number) {}

  async getAllDepositosSucursal(sucursalId: number) {}

  async getAllEgresosSucursal(sucursalId: number) {}

  update(id: number, updateSucursalSaldoDto: UpdateSucursalSaldoDto) {
    return `This action updates a #${id} sucursalSaldo`;
  }

  remove(id: number) {
    return `This action removes a #${id} sucursalSal do`;
  }
}
