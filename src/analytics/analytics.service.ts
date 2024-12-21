import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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

  async getVentasSemanalChart(sucursalId: number) {
    try {
      const fechaActual = new Date();

      // Calcular el primer día de la semana (lunes)
      const diaSemana = fechaActual.getDay();
      const diferencia = diaSemana === 0 ? -6 : 1 - diaSemana;
      const primerDiaSemana = new Date(
        fechaActual.setDate(fechaActual.getDate() + diferencia),
      );
      primerDiaSemana.setHours(0, 0, 0, 0);

      const ultimoDiaSemana = new Date(primerDiaSemana);
      ultimoDiaSemana.setDate(primerDiaSemana.getDate() + 6);
      ultimoDiaSemana.setHours(23, 59, 59, 999);

      // Obtener ventas agrupadas por día de la semana con suma y conteo
      const ventasPorDia = await this.prisma.venta.groupBy({
        by: ['fechaVenta'],
        where: {
          sucursalId: sucursalId,
          fechaVenta: {
            gte: primerDiaSemana,
            lte: ultimoDiaSemana,
          },
        },
        _sum: {
          totalVenta: true,
        },
        _count: {
          id: true,
        },
      });

      const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
      const ventasSemanal = diasSemana.map((dia, index) => ({
        dia,
        totalVenta: 0,
        ventas: 0,
        fecha: new Date(
          primerDiaSemana.getTime() + index * 24 * 60 * 60 * 1000,
        ).toISOString(),
      }));

      // Asignar los montos de ventas y cantidad de ventas a cada día correspondiente
      ventasPorDia.forEach((venta) => {
        const fechaVenta = new Date(venta.fechaVenta);
        fechaVenta.setHours(0, 0, 0, 0); // Normalizar la fecha para asegurarnos de que coincida solo por día
        const diaIndex = (fechaVenta.getDay() + 6) % 7; // Convertir para que el índice empiece en lunes

        if (ventasSemanal[diaIndex]) {
          ventasSemanal[diaIndex].totalVenta += venta._sum.totalVenta || 0;
          ventasSemanal[diaIndex].ventas += venta._count.id || 0;
        }
      });

      return ventasSemanal;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error al calcular el monto total de ventas de la semana',
      );
    }
  }

  async getProductosMasVendidos() {
    try {
      // Consulta para obtener los 10 productos más vendidos en una sucursal específica
      const productosMasVendidos = await this.prisma.producto.findMany({
        include: {
          ventas: {
            select: {
              cantidad: true,
            },
          },
        },
      });

      // Calcular la suma total de ventas por producto
      const productosConTotalVentas = productosMasVendidos.map((producto) => {
        const totalVentas = producto.ventas.reduce(
          (total, venta) => total + venta.cantidad,
          0,
        );
        return {
          id: producto.id,
          nombre: producto.nombre,
          totalVentas,
        };
      });

      // Ordenar los productos por el total de ventas y tomar los 10 primeros
      const topProductos = productosConTotalVentas
        .sort((a, b) => b.totalVentas - a.totalVentas)
        .slice(0, 10);

      return topProductos;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error al calcular los productos más vendidos',
      );
    }
  }

  async getVentasRecientes() {
    try {
      const ventasRecientes = await this.prisma.venta.findMany({
        take: 10,
        orderBy: {
          fechaVenta: 'desc',
        },
        select: {
          id: true,
          fechaVenta: true,
          totalVenta: true,
          sucursal: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      });

      return ventasRecientes;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al conseguir ventas recientes');
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

  async getVentasDia(idSucursal: number): Promise<number> {
    const fechaActual = new Date();

    // Asegurar que los rangos se calculan en UTC
    const inicioDia = new Date(
      Date.UTC(
        fechaActual.getUTCFullYear(),
        fechaActual.getUTCMonth(),
        fechaActual.getUTCDate(),
        0,
        0,
        0,
      ),
    );
    const finDia = new Date(
      Date.UTC(
        fechaActual.getUTCFullYear(),
        fechaActual.getUTCMonth(),
        fechaActual.getUTCDate(),
        23,
        59,
        59,
      ),
    );

    try {
      const ventasTotalMonto = await this.prisma.venta.aggregate({
        where: {
          sucursalId: idSucursal,
          fechaVenta: {
            gte: inicioDia,
            lte: finDia,
          },
        },
        _sum: {
          totalVenta: true,
        },
      });

      return ventasTotalMonto._sum.totalVenta || 0; // Si no hay ventas, retornar 0
    } catch (error) {
      console.error('Error al calcular las ventas del día:', error);
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
