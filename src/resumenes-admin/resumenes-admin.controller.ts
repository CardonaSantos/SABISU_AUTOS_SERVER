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
import { ResumenesAdminService } from './resumenes-admin.service';
import { CreateResumenesAdminDto } from './dto/create-resumenes-admin.dto';
import { UpdateResumenesAdminDto } from './dto/update-resumenes-admin.dto';

@Controller('resumenes-admin')
export class ResumenesAdminController {
  constructor(private readonly resumenesAdminService: ResumenesAdminService) {}

  @Post()
  create(@Body() createResumenesAdminDto: CreateResumenesAdminDto) {}

  /**
   * Para resumen diario y ver cuadres coherentes de cajas
   * @param sucursalId
   * @param date
   * @returns
   */
  // dashboard.controller.ts
  @Get('admin/resumen-diario')
  async getResumenDiario(
    @Query('sucursalId', ParseIntPipe) sucursalId: number,
    @Query('date') date: string,
  ) {
    return this.resumenesAdminService.resumenDiarioAdmin(sucursalId, date);
  }

  @Get('saldos-historico')
  async getGlobalHistorico(
    @Query('sucursalId', ParseIntPipe) sucursalId: number,
    // @Query('date') date: string,
  ) {
    return this.resumenesAdminService.getGlobalHistorico(sucursalId);
  }

  //CONTROLLERS PARA SUCURSAL Y GLOBAL
  @Get('historico-sucursal')
  async historicoSucursal(
    @Query('sucursalId') sucursalIdStr: string,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('tz') tz = '-06:00',
  ) {
    const sucursalId = Number(sucursalIdStr);
    if (!sucursalId || !from || !to) {
      throw new BadRequestException('sucursalId, from y to son obligatorios');
    }
    console.log('La data llegando es: ', sucursalId, from, to);

    return this.resumenesAdminService.historicoSucursal({
      sucursalId,
      from,
      to,
      tz,
    });
  }

  @Get('historico-global')
  async historicoGlobal(
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('tz') tz = '-06:00',
  ) {
    if (!from || !to)
      throw new BadRequestException('from y to son obligatorios');
    return this.resumenesAdminService.historicoGlobal({ from, to, tz });
  }

  @Get('get-depositos-cierres-proveedores')
  async getDepositos(
    @Query('sucursalId', ParseIntPipe) sucursalId: number,
    // @Query('date') date: string,
  ) {
    return this.resumenesAdminService.getDepositosGroupBy(sucursalId);
  }

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateResumenesAdminDto: UpdateResumenesAdminDto,
  ) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
