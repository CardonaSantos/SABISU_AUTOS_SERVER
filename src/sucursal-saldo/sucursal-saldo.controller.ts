import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
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

  @Get()
  findAll() {
    return this.sucursalSaldoService.findAll();
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

  //CONSEGUIR EL SALDO DE ESTA SUCURSAL / SINO CREA EL REGISTRO
  @Get(':id')
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
