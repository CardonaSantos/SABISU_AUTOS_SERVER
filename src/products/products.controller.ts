import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateNewProductDto } from './dto/create-productNew.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { join } from 'path';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  //CREAR

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  async create(
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @Body() body: Record<string, any>, // recibimos todo en crudo
  ) {
    // 1) Parseamos/convertimos los campos que vienen como string
    const dto = new CreateNewProductDto();
    dto.nombre = body.nombre;
    dto.descripcion = body.descripcion || null;
    dto.codigoProducto = body.codigoProducto;
    dto.codigoProveedor = body.codigoProveedor || null;
    dto.stockMinimo = Number(body.stockMinimo) || null;
    dto.precioCostoActual = Number(body.precioCostoActual);
    // categorías y precios vienen serializados como JSON
    dto.categorias = JSON.parse(body.categorias || '[]');
    dto.precioVenta = JSON.parse(body.precioVenta || '[]');
    dto.creadoPorId = Number(body.creadoPorId);

    // 2) Convertimos los archivos a base64 (si tu servicio espera base64)
    dto.imagenes = (files.images || []).map((file) => {
      const b64 = file.buffer.toString('base64');
      return `data:${file.mimetype};base64,${b64}`;
    });

    // 3) Llamamos al servicio “normal” pasándole el DTO completo
    return this.productsService.create(dto);
  }

  @Get('/sucursal/:id')
  async findAllProductToSale(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.findAllProductsToSale(id);
  }
  // findAllProductsToSale
  //ENCONTRAR TODAS PARA INVENTARIADO
  @Get('/products/for-inventary')
  async findAll() {
    return await this.productsService.findAll();
  }

  @Get('/products/to-transfer/:id')
  async findAllProductsToTransfer(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.findAllProductsToTransfer(id);
  }

  @Get('/products/for-set-stock')
  async findAllProductsToStcok() {
    return await this.productsService.findAllProductsToStcok();
  }

  @Get('/product/get-one-product/:id')
  async productToEdit(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.productToEdit(id);
  }

  @Get('/products-to-credit')
  async productToCredit() {
    return await this.productsService.productToCredit();
  }

  @Get('/historial-price')
  async productHistorialPrecios() {
    return await this.productsService.productHistorialPrecios();
  }

  @Get('/product-to-warranty')
  async productToWarranty() {
    return await this.productsService.productToWarranty();
  }

  @Get('/carga-masiva')
  async makeCargaMasiva() {
    const ruta = join(process.cwd(), 'src', 'assets', 'productos_ejemplo.csv');
    return await this.productsService.loadCSVandImportProducts(ruta);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.findOne(id);
  }

  @Patch('actualizar/producto/:id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 10 }]))
  async update(
    @Param('id') id: string,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @Body() body: Record<string, any>,
  ) {
    const dto = new UpdateProductDto();

    // Campos simples
    dto.nombre = body.nombre;
    dto.descripcion = body.descripcion || dto.descripcion;
    dto.codigoProducto = body.codigoProducto;
    dto.codigoProveedor = body.codigoProveedor || dto.codigoProveedor;
    dto.stockMinimo =
      body.stockMinimo != null ? Number(body.stockMinimo) : dto.stockMinimo;
    dto.precioCostoActual =
      body.precioCostoActual != null
        ? Number(body.precioCostoActual)
        : dto.precioCostoActual;

    // Arrays via JSON.parse
    dto.categorias = body.categorias
      ? JSON.parse(body.categorias)
      : dto.categorias;

    dto.precios = body.precios ? JSON.parse(body.precios) : dto.precios;

    // Convertir archivos nuevos a base64
    const nuevas = (files.images || []).map((file) => {
      const b64 = file.buffer.toString('base64');
      return `data:${file.mimetype};base64,${b64}`;
    });

    // Unir URLs previas + nuevas imágenes
    dto.imagenes = [...nuevas];

    // Llamas tu servicio con id + dto
    return this.productsService.update(Number(id), dto);
  }

  @Delete('/delete-image-from-product/:id/:imageId')
  async removeImageFromProduct(
    @Param('id') id: string,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    const decodedId = decodeURIComponent(id); // ← si lo necesitas en formato limpio
    return this.productsService.removeImageFromProduct(decodedId, imageId);
  }

  @Delete('/delete-all')
  async removeAll() {
    return await this.productsService.removeAll();
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.remove(id);
  }
}
