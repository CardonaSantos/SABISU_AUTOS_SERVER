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

  async findOne(sucursalId: number) {
    try {
      const sucursalSaldo = await this.prisma.sucursalSaldo.findUnique({
        where: {
          sucursalId: sucursalId,
        },
      });

      if (!sucursalSaldo) {
        const nuevaTablaSaldo = await this.prisma.sucursalSaldo.create({
          data: {
            sucursalId: sucursalId,
            totalEgresos: 0,
            totalIngresos: 0,
            saldoAcumulado: 0,
          },
        });
        console.log('Nuevo registro de la tabla creada: ', nuevaTablaSaldo);
        return nuevaTablaSaldo;
      }
      console.log('El registro ya existe: ', sucursalSaldo);

      return sucursalSaldo;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al conseguir tablas');
    }
  }

  async getAllDepositosSucursal(sucursalId: number) {
    try {
      const misRegistrosDepositos = await this.prisma.deposito.findMany({
        orderBy: {
          fechaDeposito: 'desc',
        },
        where: {
          sucursalId,
        },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              rol: true,
            },
          },
          sucursal: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      });
      return misRegistrosDepositos;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Error al encontrart registros no vinculador de esta sucursal',
      );
    }
  }

  async getAllEgresosSucursal(sucursalId: number) {
    try {
      const misRegistrosDepositos = await this.prisma.egreso.findMany({
        orderBy: {
          fechaEgreso: 'desc',
        },
        where: {
          sucursalId,
        },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              rol: true,
            },
          },
        },
      });
      return misRegistrosDepositos;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Error al encontrart registros no vinculador de esta sucursal',
      );
    }
  }

  update(id: number, updateSucursalSaldoDto: UpdateSucursalSaldoDto) {
    return `This action updates a #${id} sucursalSaldo`;
  }

  remove(id: number) {
    return `This action removes a #${id} sucursalSaldo`;
  }
}
