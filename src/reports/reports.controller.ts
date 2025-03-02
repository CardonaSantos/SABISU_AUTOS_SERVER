import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Response } from 'express'; // Importar Response de Express
import {
  Res,
  Query,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  //VENTAS REPORTE
  @Get('/ventas/excel')
  async getVentasExcel(
    @Res() res: Response,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('minTotal') minTotal?: string,
    @Query('maxTotal') maxTotal?: string,
  ) {
    console.log('Entrando al service de ventas excel');
    console.log('from', from);
    console.log('to', to);
    console.log('minTotal', minTotal);
    console.log('maxTotal', maxTotal);

    // Proporcionar valores predeterminados si no se envían
    const min = minTotal ? parseFloat(minTotal) : 0;
    const max = maxTotal ? parseFloat(maxTotal) : Infinity;

    if (isNaN(min) || isNaN(max)) {
      throw new BadRequestException(
        'Los valores de minTotal o maxTotal no son válidos.',
      );
    }

    const buffer = await this.reportsService.generarExcelVentas(
      from,
      to,
      min,
      max,
    );

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=ventas-diarias.xlsx',
    );

    res.send(buffer);
  }

  //VENTAS REPORTE
  @Get('/creditos/excel')
  async getCreditosExcel(
    @Res() res: Response,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('minTotal') minTotal?: string,
    @Query('maxTotal') maxTotal?: string,
  ) {
    // Proporcionar valores predeterminados si no se envían
    const min = minTotal ? parseFloat(minTotal) : 0;
    const max = maxTotal ? parseFloat(maxTotal) : Infinity;

    if (isNaN(min) || isNaN(max)) {
      throw new BadRequestException(
        'Los valores de minTotal o maxTotal no son válidos.',
      );
    }

    const buffer = await this.reportsService.generarCreditosReport(
      from,
      to,
      // min,
      // max,
    );

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=ventas-diarias.xlsx',
    );

    res.send(buffer);
  }

  //Metas REPORTE
  //VENTAS REPORTE
  @Get('/metas/excel')
  async getMetasExcel(
    @Res() res: Response,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('minTotal') minTotal?: string,
    @Query('maxTotal') maxTotal?: string,
  ) {
    // Proporcionar valores predeterminados si no se envían
    const min = minTotal ? parseFloat(minTotal) : 0;
    const max = maxTotal ? parseFloat(maxTotal) : Infinity;

    if (isNaN(min) || isNaN(max)) {
      throw new BadRequestException(
        'Los valores de minTotal o maxTotal no son válidos.',
      );
    }

    const buffer = await this.reportsService.generarMetasReport(
      from,
      to,
      // min,
      // max,
    );

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=ventas-diarias.xlsx',
    );

    res.send(buffer);
  }
}
