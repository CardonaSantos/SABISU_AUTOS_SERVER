import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MovimientoFinancieroService } from './movimiento-financiero.service';
import { CreateMovimientoFinancieroDto } from './dto/create-movimiento-financiero.dto';
import { UpdateMovimientoFinancieroDto } from './dto/update-movimiento-financiero.dto';
import { CrearMovimientoDto } from './dto/crear-movimiento.dto';

@Controller('movimiento-financiero')
export class MovimientoFinancieroController {
  constructor(
    private readonly movimientoFinancieroService: MovimientoFinancieroService,
  ) {}

  @Post()
  create(@Body() dto: CrearMovimientoDto) {
    return this.movimientoFinancieroService.crearMovimiento(dto);
  }

  @Get()
  findAll() {
    return this.movimientoFinancieroService.findAll();
  }

  @Get('get-simples')
  getMovimientosFinancieros() {
    return this.movimientoFinancieroService.getMovimientosFinancierosSimple();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.movimientoFinancieroService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMovimientoFinancieroDto: UpdateMovimientoFinancieroDto,
  ) {
    return this.movimientoFinancieroService.update(
      +id,
      updateMovimientoFinancieroDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.movimientoFinancieroService.remove(+id);
  }
}
