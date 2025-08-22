import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { UpdatePedidoDto } from './dto/update-pedido.dto';
import { GetPedidosQueryDto } from './Querys/getPedidosQuery.dto';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post('create-pedido')
  create(@Body() dto: CreatePedidoDto) {
    return this.pedidosService.createPedidoMain(dto);
  }

  @Get()
  // @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  getToTable(@Query() query: GetPedidosQueryDto) {
    return this.pedidosService.getPedidos(query);
  }
}
