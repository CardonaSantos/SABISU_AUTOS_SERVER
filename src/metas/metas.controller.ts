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
import { MetasService } from './metas.service';
import { CreateMetaDto } from './dto/create-meta.dto';
import { UpdateMetaDto } from './dto/update-meta.dto';
import { CreateMetaUsuarioDto } from './dto/MetaUsuarioDTO.dto';
import { CreateMetaCobrosDto } from './dto/MetaCobrosDTO.dto';
import { CreateDepositoCobroDto } from './dto/DepositoCobroDTO.dto';

@Controller('metas')
export class MetasController {
  constructor(private readonly metasService: MetasService) {}

  //CREAR UNA META PARA UN VENDEDOR O USUARIO
  @Post()
  create(@Body() createMetaDTO: CreateMetaUsuarioDto) {
    return this.metasService.createSellerGoal(createMetaDTO);
  }

  @Post('/regist-new-meta-cobros')
  createNewGoalCobros(@Body() createMetaCobro: CreateMetaCobrosDto) {
    return this.metasService.createNewGoalCobros(createMetaCobro);
  }

  //REGISTRAR NUEVOS COBROS O DEPOSITOS

  @Post('/create-new-payment-cobros')
  createNewPaymentCobro(@Body() createDepositoDTO: CreateDepositoCobroDto) {
    return this.metasService.createNewPaymentCobro(createDepositoDTO);
  }

  //CONSEGUIR LOS REGISTROS DE MI SUCURSAL CORRESPONDIENTE

  @Get('/get-all-cobros-metas/:id')
  findAllCobrosMetas(@Param('id', ParseIntPipe) id: number) {
    return this.metasService.findAllCobrosMetas(id);
  }

  @Get('/get-all-seller-goals/:id')
  findAllSellerGoal(@Param('id', ParseIntPipe) id: number) {
    return this.metasService.findAllSellerGoal(id);
  }

  @Get('/get-all-my-goals/:id')
  getMyGoalsAndMore(@Param('id', ParseIntPipe) id: number) {
    return this.metasService.getMyGoalsAndMore(id);
  }

  @Get('/delete-all')
  deleteAll() {
    return this.metasService.deleteAll();
  }

  @Get('/get-all-metas-users')
  deleteAllMetasUsers() {
    return this.metasService.deleteAllMetasUsers();
  }

  //CONSEGUIR REGISTROS DE PAGOS DE MI META
  // @Get('/get-all-payments-goal/:id')
  // getAllPaymentsGoal(@Param('id', ParseIntPipe) id: number) {
  //   return this.metasService.getAllPaymentsGoal(id);
  // }

  //CREAR DEPOSITO DE COBROS

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.metasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMetaDto: UpdateMetaDto) {
    return this.metasService.update(+id, updateMetaDto);
  }

  @Delete('/delete-one-payment/:metaId/:id')
  removeOneDepo(
    @Param('metaId', ParseIntPipe) metaId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.metasService.removeOneDepo(metaId, id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.metasService.remove(+id);
  }
}
