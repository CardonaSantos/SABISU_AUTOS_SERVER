import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as ExcelJS from 'exceljs';
import { formatInTimeZone } from 'date-fns-tz';

import { format } from 'date-fns';
// import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

// import { utcToZonedTime } from "date-fns-tz";

const formatearFecha = (fecha) => {
  const zonaHoraria = 'America/Guatemala'; // Zona horaria de Guatemala
  const date = new Date(fecha);

  // Validar que la fecha es válida
  if (isNaN(date.getTime())) {
    throw new Error('Fecha inválida');
  }

  // Convertir la fecha UTC a la zona horaria de Guatemala
  const fechaLocal = toZonedTime(date, zonaHoraria);

  // Formatear la fecha local
  return format(fechaLocal, 'dd/MM/yyyy hh:mm a');
};

@Injectable()
export class ReportsService {
  //
  constructor(private readonly prisma: PrismaService) {}

  async generarExcelVentas(
    from?: string,
    to?: string,
    minTotal: number = 0,
    maxTotal: number = Infinity,
  ): Promise<Buffer> {
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    // Construcción dinámica de filtros
    const whereConditions: any = {
      totalVenta: {
        gte: minTotal,
      },
    };

    if (maxTotal !== Infinity) {
      whereConditions.totalVenta.lte = maxTotal;
    }

    if (fromDate || toDate) {
      whereConditions.fechaVenta = {
        ...(fromDate && { gte: fromDate }),
        ...(toDate && { lte: toDate }),
      };
    }

    const ventas = await this.prisma.venta.findMany({
      where: whereConditions,
      include: {
        cliente: true,
        sucursal: true,
        metodoPago: {
          select: {
            metodoPago: true,
          },
        },
        productos: {
          include: {
            producto: true,
          },
        },
      },
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Ventas');

    sheet.columns = [
      { header: 'ID Venta', key: 'id', width: 15 },
      { header: 'Fecha Venta', key: 'fechaVenta', width: 20 },
      { header: 'Cliente', key: 'cliente', width: 30 },
      { header: 'Teléfono Cliente', key: 'telefonoCliente', width: 15 },
      { header: 'Dirección Cliente', key: 'direccionCliente', width: 30 },
      { header: 'Sucursal', key: 'sucursal', width: 25 },
      { header: 'Productos', key: 'productos', width: 50 },
      { header: 'Total Venta', key: 'totalVenta', width: 15 },
      { header: 'Método de Pago', key: 'metodoPago', width: 20 },
    ];

    ventas.forEach((venta) => {
      const productosFormatted = venta.productos
        .map(
          (prod) =>
            `${prod.cantidad}x ${prod.producto?.nombre || 'Producto desconocido'} (Q${prod.precioVenta.toFixed(
              2,
            )})`,
        )
        .join('\n');

      sheet.addRow({
        id: venta.id,
        fechaVenta: formatearFecha(venta.fechaVenta.toISOString()),
        cliente: venta.cliente?.nombre || venta.nombreClienteFinal || 'CF',
        telefonoCliente:
          venta.cliente?.telefono || venta.telefonoClienteFinal || 'N/A',
        direccionCliente:
          venta.cliente?.direccion || venta.direccionClienteFinal || 'N/A',
        sucursal: venta.sucursal?.nombre || 'N/A',
        productos: productosFormatted,
        totalVenta: `Q${venta.totalVenta.toFixed(2)}`,
        metodoPago: venta.metodoPago?.metodoPago || 'N/A',
      });
    });

    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'left',
          wrapText: true,
        };
      });
    });

    const uint8Array = await workbook.xlsx.writeBuffer();
    return Buffer.from(uint8Array);
  }
}
