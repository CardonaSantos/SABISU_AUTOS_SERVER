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

  // ---------------------------
  // Collection - READ primero (rutas específicas antes de genéricas)
  // ---------------------------

  // GET /cuentas-bancarias/resumen-page
  @Get('resumen-page')
  getResumenPage(@Query() query: QueryCuentaBancariaDto) {
    return this.cuentasBancariasService.getResumenPage(query);
  }

  // GET /cuentas-bancarias/get-simple-select
  @Get('get-simple-select')
  getCuentasBancariasSimple() {
    return this.cuentasBancariasService.getCuentasBancariasSimple();
  }

  // GET /cuentas-bancarias
  @Get()
  findAll(@Query() query: QueryCuentaBancariaDto) {
    return this.cuentasBancariasService.findAll(query);
  }

  // ---------------------------
  // Collection - CREATE
  // ---------------------------

  // POST /cuentas-bancarias
  @Post()
  create(@Body() dto: CreateCuentaBancariaDto) {
    return this.cuentasBancariasService.create(dto);
  }

  // ---------------------------
  // Resource - READ / UPDATE / STATE / DELETE
  // (rutas específicas antes de genéricas por método)
  // ---------------------------

  // GET /cuentas-bancarias/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cuentasBancariasService.findOne(id);
  }

  // PATCH /cuentas-bancarias/:id/activar
  @Patch(':id/activar')
  activate(@Param('id', ParseIntPipe) id: number) {
    return this.cuentasBancariasService.activate(id);
  }

  // PATCH /cuentas-bancarias/:id/desactivar
  @Patch(':id/desactivar')
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.cuentasBancariasService.deactivate(id);
  }

  // PATCH /cuentas-bancarias/:id
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCuentaBancariaDto,
  ) {
    return this.cuentasBancariasService.update(id, dto);
  }

  // DELETE /cuentas-bancarias/:id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cuentasBancariasService.remove(id);
  }
}
