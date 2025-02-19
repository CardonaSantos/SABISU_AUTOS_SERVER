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
    console.log('Entrando al service de excel de ventas con los datos:');
    console.log({ from, to, minTotal, maxTotal });

    const whereConditions: any = {};
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    if (fromDate && toDate) {
      // Both dates provided: from start of 'from' day to end of 'to' day
      fromDate.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);
      whereConditions.fechaVenta = { gte: fromDate, lte: toDate };
    } else if (fromDate) {
      // Only 'from' provided: from the start of that day
      fromDate.setHours(0, 0, 0, 0);
      whereConditions.fechaVenta = { gte: fromDate };
    } else if (toDate) {
      // Only 'to' provided: filter exactly that day
      const startOfDay = new Date(toDate);
      startOfDay.setHours(0, 0, 0, 0);
      toDate.setHours(23, 59, 59, 999);
      whereConditions.fechaVenta = { gte: startOfDay, lte: toDate };
    }

    // 2. Lógica de MONTOS (evita errores si totalVenta no existe)
    whereConditions.totalVenta = {};
    if (minTotal > 0) {
      whereConditions.totalVenta.gte = minTotal;
    }
    if (maxTotal !== Infinity) {
      whereConditions.totalVenta.lte = maxTotal;
    }

    console.log('Condiciones de búsqueda:', whereConditions);

    // Obtener las ventas filtradas
    const ventas = await this.prisma.venta.findMany({
      where: whereConditions,
      include: {
        cliente: true,
        sucursal: true,
        metodoPago: { select: { metodoPago: true } },
        productos: { include: { producto: true } },
      },
    });

    // Crear el Excel
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Ventas');

    // Configuración de columnas
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

    // Rellenar filas con datos
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

    // Aplicar estilos a las celdas
    sheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'left',
          wrapText: true,
        };
      });
    });

    // Exportar a Buffer
    const uint8Array = await workbook.xlsx.writeBuffer();
    return Buffer.from(uint8Array);
  }

  async generarCreditosReport(from?: string, to?: string): Promise<Buffer> {
    try {
      console.log('Generando reporte de créditos...', { from, to });

      // Configurar filtros de fechas
      const whereConditions: any = {};
      const fromDate = from ? new Date(from) : undefined;
      const toDate = to ? new Date(to) : undefined;

      if (fromDate && toDate) {
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);
        whereConditions.creadoEn = { gte: fromDate, lte: toDate };
      } else if (fromDate) {
        fromDate.setHours(0, 0, 0, 0);
        whereConditions.creadoEn = { gte: fromDate };
      } else if (toDate) {
        const startOfDay = new Date(toDate);
        startOfDay.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999);
        whereConditions.creadoEn = { gte: startOfDay, lte: toDate };
      }

      console.log('Condiciones de búsqueda:', whereConditions);

      // Obtener los créditos filtrados
      const creditos = await this.prisma.ventaCuota.findMany({
        where: whereConditions,
        include: {
          cliente: { select: { nombre: true, telefono: true } },
          cuotas: { select: { id: true, monto: true, creadoEn: true } },
        },
      });

      console.log('Los creditos son: ', creditos);

      // Crear el archivo Excel
      const workbook = new ExcelJS.Workbook();
      const creditosSheet = workbook.addWorksheet('Historial de Créditos');
      const pagosSheet = workbook.addWorksheet('Pagos de Créditos');
      const creditosTotales = workbook.addWorksheet('Creditos Totales');

      // Configuración de columnas
      creditosSheet.columns = [
        { header: 'ID Crédito', key: 'id', width: 15 },
        { header: 'Cliente', key: 'cliente', width: 30 },
        { header: 'Teléfono', key: 'telefono', width: 15 },
        { header: 'Monto con Interés', key: 'montoConInteres', width: 20 },
        { header: 'Interés (%)', key: 'interes', width: 15 },
        { header: 'Fecha Inicio', key: 'fechaInicio', width: 20 },
        { header: 'Estado', key: 'estado', width: 15 },
      ];

      pagosSheet.columns = [
        { header: 'ID Crédito', key: 'creditoId', width: 15 },
        { header: 'ID Pago', key: 'id', width: 15 },
        { header: 'Monto', key: 'monto', width: 15 },
        { header: 'Fecha Pago', key: 'timestamp', width: 20 },
      ];

      creditosTotales.columns = [
        { header: 'ID Crédito', key: 'creditoId', width: 15 },
        { header: 'Fecha', key: 'fecha', width: 15 },
        { header: 'Pagos', key: 'pagos', width: 15 },
        { header: 'Otorgados', key: 'otorgados', width: 20 },
        { header: 'Pagos', key: 'pagado', width: 20 },
        { header: 'Por recuperar', key: 'porRecuperar', width: 20 },
      ];

      creditos.forEach((credito) => {
        creditosTotales.addRow({
          creditoId: credito.id,
          fecha: credito.fechaInicio,
          pagos: credito.cuotas.length,
          otorgados: credito.montoTotalConInteres,
          pagado: credito.totalPagado,
          porRecuperar: credito.montoTotalConInteres - credito.totalPagado,
        });
      });

      // Rellenar filas con datos
      creditos.forEach((credito) => {
        creditosSheet.addRow({
          id: credito.id,
          cliente: credito.cliente?.nombre || 'Sin cliente',
          telefono: credito.cliente?.telefono || 'N/A',
          montoConInteres: credito.montoTotalConInteres,
          interes: credito.interes,
          fechaInicio: formatearFecha(credito.fechaInicio.toISOString()),
          estado: credito.estado,
        });

        credito.cuotas.forEach((cuota) => {
          pagosSheet.addRow({
            creditoId: credito.id,
            id: cuota.id,
            monto: cuota.monto,
            timestamp: formatearFecha(cuota.creadoEn.toISOString()),
          });
        });
      });

      // Aplicar estilos
      [creditosSheet, pagosSheet].forEach((sheet) => {
        sheet.eachRow((row) => {
          row.eachCell((cell) => {
            cell.alignment = {
              vertical: 'middle',
              horizontal: 'left',
              wrapText: true,
            };
          });
        });
      });

      // Exportar a Buffer
      const uint8Array = await workbook.xlsx.writeBuffer();
      return Buffer.from(uint8Array);
    } catch (error) {
      console.error('Error al generar reporte de créditos:', error);
      throw new Error('Hubo un problema generando el reporte de créditos.');
    }
  }
}
