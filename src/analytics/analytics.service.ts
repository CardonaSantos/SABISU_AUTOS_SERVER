import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAnalyticsDto } from './dto/create-analytics.dto';
import { UpdateAnalyticsDto } from './dto/update-analytics.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTotalVentasMontoSemana(sucursalId: number) {
    try {
      // Obtener la fecha actual
      const fechaActual = new Date();

      // Calcular el primer día de la semana (lunes)
      const diaSemana = fechaActual.getDay();
      const diferencia = diaSemana === 0 ? -6 : 1 - diaSemana; // Si es domingo (0), retroceder 6 días; sino, calcular desde lunes
      const primerDiaSemana = new Date(
        fechaActual.setDate(fechaActual.getDate() + diferencia),
      );
      primerDiaSemana.setHours(0, 0, 0, 0); // Establecer hora al inicio del día (00:00)

      // Calcular el último día de la semana (domingo)
      const ultimoDiaSemana = new Date(primerDiaSemana);
      ultimoDiaSemana.setDate(primerDiaSemana.getDate() + 6);
      ultimoDiaSemana.setHours(23, 59, 59, 999); // Establecer hora al final del día (23:59:59)

      // Inicializar el monto total de la semana
      let montoTotalSemana = 0;

      // Consultar las ventas de la semana
      const ventasTotalMonto = await this.prisma.venta.findMany({
        where: {
          sucursalId: sucursalId,
          fechaVenta: {
            gte: primerDiaSemana,
            lte: ultimoDiaSemana,
          },
        },
        select: {
          totalVenta: true,
        },
      });

      // Sumar los montos de las ventas
      ventasTotalMonto.forEach((venta) => {
        montoTotalSemana += venta.totalVenta;
      });

      return montoTotalSemana; // Devolver el monto total de la semana
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error al calcular el monto total de ventas de la semana',
      );
    }
  }

  //--------------------------------------------------

  async getVentasMes(idSucursal: number) {
    try {
      const añoActual = new Date().getFullYear();
      const mesActual = new Date().getMonth();
      const primerDia = new Date(añoActual, mesActual, 1);
      const ultimoDia = new Date(añoActual, mesActual + 1, 0);

      const ventasMes = await this.prisma.venta.findMany({
        where: {
          sucursalId: idSucursal,
          fechaVenta: {
            gte: primerDia,
            lte: ultimoDia,
          },
        },
        orderBy: {
          fechaVenta: 'desc',
        },
        select: {
          totalVenta: true,
        },
      });

      const totalVentasMes = ventasMes.reduce(
        (total, venta) => total + venta.totalVenta,
        0,
      );

      return totalVentasMes;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error al encontrar los registros de venta',
      );
    }
  }

  async getVentasDia(idSucursal: number) {
    const fechaActual = new Date();

    // Calcular el inicio y fin del día actual (desde las 00:00 hasta las 23:59)
    const inicioDia = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth(),
      fechaActual.getDate(),
      0,
      0,
      0,
    );
    const finDia = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth(),
      fechaActual.getDate(),
      23,
      59,
      59,
    );

    try {
      let montoTotalDia = 0;

      // Consultar las ventas del día actual
      const ventasTotalMonto = await this.prisma.venta.findMany({
        where: {
          sucursalId: idSucursal,
          fechaVenta: {
            gte: inicioDia,
            lte: finDia,
          },
        },
        select: {
          totalVenta: true,
        },
      });

      ventasTotalMonto.forEach((venta) => {
        montoTotalDia += venta.totalVenta;
      });

      return montoTotalDia; // Devolver el monto total del día
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error al calcular el monto total de ventas del día',
      );
    }
  }

  create(createAnalyticsDto: CreateAnalyticsDto) {
    return 'This action adds a new analytics';
  }

  findAll() {
    return `This action returns all analytics`;
  }

  findOne(id: number) {
    return `This action returns a #${id} analytics`;
  }

  update(id: number, updateAnalyticsDto: UpdateAnalyticsDto) {
    return `This action updates a #${id} analytics`;
  }

  remove(id: number) {
    return `This action removes a #${id} analytics`;
  }
}
