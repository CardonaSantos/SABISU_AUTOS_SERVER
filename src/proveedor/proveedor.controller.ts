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
import { ProveedorService } from './proveedor.service';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';

@Controller('proveedor')
export class ProveedorController {
  constructor(private readonly proveedorService: ProveedorService) {}

  @Post()
  async create(@Body() createProveedorDto: CreateProveedorDto) {
    return await this.proveedorService.create(createProveedorDto);
  }

  @Get()
  async findAll() {
    return await this.proveedorService.findAll();
  }

  @Get('/simple-proveedor')
  async findAllSimpleProveedor() {
    return await this.proveedorService.findAllSimpleProveedor();
  }

  @Get('/get-complete-providers')
  async finAllCompleteProvider() {
    return await this.proveedorService.findCompleteProvider();
  }

  @Get('/get-provider-to-warranty/')
  async findProvidersWarranty() {
    return await this.proveedorService.findProvidersWarranty();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.proveedorService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProveedorDto: UpdateProveedorDto,
  ) {
    return await this.proveedorService.update(id, updateProveedorDto);
  }

  @Patch('/edit-provider/:id')
  async updateProvider(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProveedorDto: UpdateProveedorDto,
  ) {
    return await this.proveedorService.updateProvider(id, updateProveedorDto);
  }

  @Delete('/delete-all')
  async removeAll() {
    return await this.proveedorService.removeAll();
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.proveedorService.remove(id);
  }
}
