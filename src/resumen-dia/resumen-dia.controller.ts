import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ResumenDiaService } from './resumen-dia.service';
import { CreateResumenDiaDto } from './dto/create-resumen-dia.dto';
import { UpdateResumenDiaDto } from './dto/update-resumen-dia.dto';
import { ResumenDiarioResponse } from './types';
import { ResumenDiarioQueryDto } from './dto/ResumenDiarioQueryDto.dto';
import { ResumenHistoricoQueryDto } from './dto/ResumenHistoricoQueryDto.dto';
import { FlujoMensualQueryDto } from './dto/FlujoMensualQueryDto.dto';

@Controller('resumen-dia')
export class ResumenDiaController {
  constructor(private readonly resumenDiaService: ResumenDiaService) {}

  @Post()
  create(@Body() createResumenDiaDto: CreateResumenDiaDto) {
    // return this.resumenDiaService.create(createResumenDiaDto);
  }

  /**
   *
   * @param fecha DATE PRINCIPAL
   * @param sucursalId id de la sucursal opcional
   * @returns
   */
  @Get('resumen')
  getResumen(
    @Query('fecha') fecha?: string,
    @Query('sucursalId') sucursalId?: string,
  ) {
    // return this.resumenDiaService.getResumenDiario({
    //   fecha,
    //   sucursalId: sucursalId ? Number(sucursalId) : undefined,
    // });
  }

  // // Diario (lo que ya usa tu página)
  // @Get('resumen/diario')
  // getResumenDiario(@Query() q: ResumenDiarioQueryDto) {
  //   return this.resumenDiaService.getResumenDiario(q);
  // }

  // Histórico por rango (para “Caja ▸ Resumen Admin ▸ Histórico”)
  @Get('resumen/historico')
  getResumenHistorico(@Query() q: ResumenHistoricoQueryDto) {
    return this.resumenDiaService.getResumenHistorico(q);
  }

  // Serie mensual para gráficas rápidas
  @Get('flujo-mensual')
  getFlujoMensual(@Query() q: FlujoMensualQueryDto) {
    return this.resumenDiaService.getFlujoMensual(q);
  }
}
