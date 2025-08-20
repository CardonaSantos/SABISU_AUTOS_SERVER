import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CuentasBancariasService } from './cuentas-bancarias.service';
import { CreateCuentasBancariaDto } from './dto/create-cuentas-bancaria.dto';
import { UpdateCuentaBancariaDto } from './dto/update-cuentas-bancaria.dto';
import { CreateCuentaBancariaDto } from './dto/create-cuenta-bancaria.dto';
import { QueryCuentaBancariaDto } from './dto/query-cuenta-bancaria.dto';

@Controller('cuentas-bancarias')
export class CuentasBancariasController {
  constructor(
    private readonly cuentasBancariasService: CuentasBancariasService,
  ) {}

  @Post()
  create(@Body() dto: CreateCuentaBancariaDto) {
    return this.cuentasBancariasService.create(dto);
  }

  @Get('get-simple-select')
  getCuentasBancariasSimple() {
    return this.cuentasBancariasService.getCuentasBancariasSimple();
  }

  @Get()
  findAll(@Query() query: QueryCuentaBancariaDto) {
    return this.cuentasBancariasService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cuentasBancariasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCuentaBancariaDto,
  ) {
    return this.cuentasBancariasService.update(id, dto);
  }

  @Patch(':id/activar')
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.cuentasBancariasService.activate(id);
  }

  @Patch(':id/desactivar')
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.cuentasBancariasService.deactivate(id);
  }

  // Opcional (hard delete si no tiene movimientos)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cuentasBancariasService.remove(id);
  }
}
