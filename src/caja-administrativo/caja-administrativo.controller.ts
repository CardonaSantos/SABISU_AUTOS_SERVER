import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { CajaAdministrativoService } from './caja-administrativo.service';
import { CreateCajaAdministrativoDto } from './dto/create-caja-administrativo.dto';
import { UpdateCajaAdministrativoDto } from './dto/update-caja-administrativo.dto';
import * as dayjs from 'dayjs';
import 'dayjs/locale/es';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { TZGT } from 'src/utils/utils';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.locale('es');

@Controller('caja-administrativo')
export class CajaAdministrativoController {
  constructor(
    private readonly cajaAdministrativoService: CajaAdministrativoService,
  ) {}

  @Get('sucursal/:sucursalId')
  async flujoSucursal(
    @Param('sucursalId', ParseIntPipe) sucursalId: number,
    @Query('from') from: string,
    @Query('to') to: string,
  ) {
    return this.cajaAdministrativoService.getFlujoSucursal({
      sucursalId,
      from: new Date(from).toISOString(),
      to: new Date(to).toISOString(),
    });
  }

  @Get('global')
  async flujoGlobal(@Query('from') from: string, @Query('to') to: string) {
    return this.cajaAdministrativoService.getFlujoGlobal({
      from: new Date(from),
      to: new Date(to),
    });
  }

  @Get('costos-venta-historico')
  async costosVentaHistorico(
    @Query('sucursalId') sucursalId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.cajaAdministrativoService.getCostosVentaHistorico({
      sucursalId: sucursalId ? Number(sucursalId) : undefined,
      from,
      to,
    });
  }

  @Get('gastos-operativos')
  async gastosOperativos(
    @Query('sucursalId') sucursalId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const dto = {
      sucursalId: sucursalId ? Number(sucursalId) : undefined,
      from: from
        ? dayjs.tz(from, 'YYYY-MM-DD', TZGT).startOf('day').toDate()
        : dayjs().tz(TZGT).startOf('month').toDate(),
      to: to
        ? dayjs.tz(to, 'YYYY-MM-DD', TZGT).endOf('day').toDate()
        : dayjs().tz(TZGT).endOf('day').toDate(),
    };

    return this.cajaAdministrativoService.getGastosOperativos(dto);
  }

  @Get('flujo-efectivo')
  async flujoEfectivo(
    @Query('sucursalId') sucursalId?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    const sucId = sucursalId ? Number(sucursalId) : undefined;

    const fromDate = from
      ? dayjs.tz(from, 'YYYY-MM-DD', TZGT).startOf('day').toDate()
      : dayjs().tz(TZGT).startOf('month').toDate();

    const toDate = to
      ? dayjs.tz(to, 'YYYY-MM-DD', TZGT).endOf('day').toDate()
      : dayjs().tz(TZGT).endOf('day').toDate();

    if (!dayjs(fromDate).isValid() || !dayjs(toDate).isValid()) {
      throw new BadRequestException('Fechas inválidas');
    }

    return this.cajaAdministrativoService.getFlujoEfectivo({
      sucursalId: sucId,
      from: fromDate,
      to: toDate,
    });
  }
}
