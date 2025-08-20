import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCuentaBancariaDto } from './dto/create-cuenta-bancaria.dto';
import { QueryCuentaBancariaDto } from './dto/query-cuenta-bancaria.dto';
import { Prisma } from '@prisma/client';
import { UpdateCuentaBancariaDto } from './dto/update-cuentas-bancaria.dto';

@Injectable()
export class CuentasBancariasService {
  constructor(private prisma: PrismaService) {}
  private readonly logger = new Logger(CuentasBancariasService.name);
  async create(dto: CreateCuentaBancariaDto) {
    try {
      const cuenta = await this.prisma.cuentaBancaria.create({
        data: {
          banco: dto.banco.trim(),
          numero: dto.numero.trim(),
          alias: dto.alias?.trim() ?? null,
          activa: dto.activa ?? true,
        },
      });
      return cuenta;
    } catch (e) {
      this.handlePrismaError(e, dto);
    }
  }

  async findAll(query: QueryCuentaBancariaDto) {
    const { page = 1, limit = 10, search, incluirInactivas } = query;

    const where: Prisma.CuentaBancariaWhereInput = {
      AND: [
        incluirInactivas ? {} : { activa: true },
        search
          ? {
              OR: [
                { banco: { contains: search, mode: 'insensitive' } },
                { numero: { contains: search, mode: 'insensitive' } },
                { alias: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
      ],
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.cuentaBancaria.findMany({
        where,
        orderBy: [{ activa: 'desc' }, { banco: 'asc' }, { alias: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          banco: true,
          numero: true,
          alias: true,
          activa: true,
          creadoEn: true,
          actualizadoEn: true,
          _count: { select: { movimientos: true } },
        },
      }),
      this.prisma.cuentaBancaria.count({ where }),
    ]);

    return {
      page,
      limit,
      total,
      items,
    };
  }

  async findOne(id: number) {
    const c = await this.prisma.cuentaBancaria.findUnique({
      where: { id },
      select: {
        id: true,
        banco: true,
        numero: true,
        alias: true,
        activa: true,
        creadoEn: true,
        actualizadoEn: true,
        _count: { select: { movimientos: true } },
      },
    });
    if (!c) throw new NotFoundException('Cuenta bancaria no encontrada');
    return c;
  }

  async update(id: number, dto: UpdateCuentaBancariaDto) {
    try {
      const up = await this.prisma.cuentaBancaria.update({
        where: { id },
        data: {
          banco: dto.banco?.trim(),
          numero: dto.numero?.trim(),
          alias: dto.alias?.trim(),
          activa: dto.activa,
        },
      });
      return up;
    } catch (e) {
      this.handlePrismaError(e, dto);
    }
  }

  // Soft delete: desactivar
  async deactivate(id: number) {
    const exists = await this.prisma.cuentaBancaria.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException('Cuenta bancaria no encontrada');

    const updated = await this.prisma.cuentaBancaria.update({
      where: { id },
      data: { activa: false },
    });
    return updated;
  }

  async activate(id: number) {
    const exists = await this.prisma.cuentaBancaria.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!exists) throw new NotFoundException('Cuenta bancaria no encontrada');

    const updated = await this.prisma.cuentaBancaria.update({
      where: { id },
      data: { activa: true },
    });
    return updated;
  }

  // Hard delete (opcional): solo si no tiene movimientos
  async remove(id: number) {
    const count = await this.prisma.movimientoFinanciero.count({
      where: { cuentaBancariaId: id },
    });
    if (count > 0) {
      throw new BadRequestException(
        'No se puede eliminar: la cuenta tiene movimientos. Desactívala en su lugar.',
      );
    }
    try {
      await this.prisma.cuentaBancaria.delete({ where: { id } });
      return { ok: true };
    } catch (e) {
      this.handlePrismaError(e);
    }
  }

  private handlePrismaError(e: any, dto?: unknown): never {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // P2002: unique constraint (banco, numero)
      if (e.code === 'P2002') {
        throw new BadRequestException(
          'Ya existe una cuenta con ese banco y número.',
        );
      }
      // P2003: FK constraint
      if (e.code === 'P2003') {
        throw new BadRequestException('Violación de integridad referencial.');
      }
    }
    throw new BadRequestException('Error al operar con cuenta bancaria.');
  }

  async getCuentasBancariasSimple() {
    try {
      const cuentas = await this.prisma.cuentaBancaria.findMany({});
      return cuentas.map((c) => ({
        id: c.id,
        nombre: c.alias,
        numero: c.numero,
        banco: c.banco,
      }));
    } catch (error) {
      this.logger.debug('El error', error);
    }
  }
}
