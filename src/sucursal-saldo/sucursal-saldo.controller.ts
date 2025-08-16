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
import { SucursalSaldoService } from './sucursal-saldo.service';
import { CreateSucursalSaldoDto } from './dto/create-sucursal-saldo.dto';
import { UpdateSucursalSaldoDto } from './dto/update-sucursal-saldo.dto';

@Controller('sucursal-saldo')
export class SucursalSaldoController {
  constructor(private readonly sucursalSaldoService: SucursalSaldoService) {}

  @Post()
  create(@Body() createSucursalSaldoDto: CreateSucursalSaldoDto) {
    return this.sucursalSaldoService.create(createSucursalSaldoDto);
  }

  @Get('global')
  findAll() {
    return this.sucursalSaldoService.findAll();
  }

  @Get('saldos/diario')
  async getSaldoDiario(
    @Query('sucursalId', ParseIntPipe) sucursalId: number,
    @Query('fecha') fechaISO?: string,
  ) {
    return this.sucursalSaldoService.getSaldoDiario(sucursalId, fechaISO);
  }

  //CONSEGUIR REGISTROS DE DEPOSITOS
  @Get('/get-sucursal-deposits/:id')
  getAllDepositosSucursal(@Param('id', ParseIntPipe) id: number) {
    return this.sucursalSaldoService.getAllDepositosSucursal(id);
  }

  //CONSEGUIR REGISTROS DE EGRESOS
  @Get('/get-sucursal-egresos/:id')
  getAllEgresosSucursal(@Param('id', ParseIntPipe) id: number) {
    return this.sucursalSaldoService.getAllEgresosSucursal(id);
  }

  // CONSEGUIR EL SALDO DIARIO DE ESTA SUCURSAL / SINO CREA EL REGISTRO
  @Get('diario/:id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sucursalSaldoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSucursalSaldoDto: UpdateSucursalSaldoDto,
  ) {
    return this.sucursalSaldoService.update(+id, updateSucursalSaldoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sucursalSaldoService.remove(+id);
  }
}
