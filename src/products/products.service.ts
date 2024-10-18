import {
  Injectable,
  InternalServerErrorException,
  MethodNotAllowedException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createProductDto: CreateProductDto) {
    try {
      const newProduct = await this.prisma.producto.create({
        data: {
          codigoProducto: createProductDto.codigoProducto,
          nombre: createProductDto.nombre,
          precioVenta: createProductDto.precioVenta,
          descripcion: createProductDto.descripcion,
          categorias: {
            //conectar por medio del id de la categoria del array enviado
            connect: createProductDto.categorias?.map((categoriaId) => ({
              id: categoriaId,
            })),
          },
        },
      });
      return newProduct;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al crear la categoria');
    }
  }

  async findAllProductsToSale() {
    try {
      const productos = await this.prisma.producto.findMany({
        include: {
          stock: {
            where: {
              cantidad: {
                gt: 0, // Solo traer productos con stock disponible
              },
            },
            select: {
              id: true,
              cantidad: true,
              fechaIngreso: true,
              fechaVencimiento: true,
            },
          },
        },
      });

      return productos;
    } catch (error) {
      console.error('Error en findAll productos:', error); // Proporcionar más contexto en el error
      throw new InternalServerErrorException('Error al obtener los productos');
    }
  }

  async findAll() {
    try {
      const productos = await this.prisma.producto.findMany({
        include: {
          categorias: {
            select: {
              id: true,
              nombre: true,
            },
          },
          stock: {
            where: {
              cantidad: {
                gt: 0, // Solo traer productos con stock disponible
              },
            },
            select: {
              id: true,
              cantidad: true,
              fechaIngreso: true,
              fechaVencimiento: true,
              entregaStock: {
                select: {
                  proveedor: {
                    select: {
                      nombre: true, // Solo seleccionamos el nombre del proveedor
                    },
                  },
                },
              },
            },
          },
        },
      });

      return productos;
    } catch (error) {
      console.error('Error en findAll productos:', error); // Proporcionar más contexto en el error
      throw new InternalServerErrorException('Error al obtener los productos');
    }
  }

  async findAllProductsToStcok() {
    try {
      const productos = await this.prisma.producto.findMany({
        select: {
          id: true,
          nombre: true,
          codigoProducto: true,
        },
      });

      return productos;
    } catch (error) {
      console.error('Error en findAll productos:', error); // Proporcionar más contexto en el error
      throw new InternalServerErrorException('Error al obtener los productos');
    }
  }

  async findOne(id: number) {
    try {
      const producto = await this.prisma.producto.findUnique({
        where: { id },
      });
      return producto;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al encontrar el producto');
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    console.log(
      'Los datos a usar son: ID: ',
      id,
      ' LOS OTROS DATOS: ',
      updateProductDto,
    );

    try {
      const productoUpdate = await this.prisma.producto.update({
        where: { id },
        data: {
          codigoProducto: updateProductDto.codigoProducto,
          nombre: updateProductDto.nombre,
          precioVenta: updateProductDto.precioVenta,
          descripcion: updateProductDto.descripcion,
          categorias: {
            set: [], // Eliminar todas las relaciones previas
            connect: updateProductDto.categorias?.map((categoriaId) => ({
              id: categoriaId,
            })),
          },
        },
        include: {
          categorias: true, // Asegurarte de que se incluyan las categorías en la respuesta
        },
      });

      console.log('El producto editado es: ', productoUpdate);

      return productoUpdate;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al actualizar el producto');
    }
  }

  async remove(id: number) {
    try {
      const producto = await this.prisma.producto.delete({
        where: { id },
      });
      return producto;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al eliminar el producto');
    }
  }

  async removeAll() {
    try {
      const productos = await this.prisma.producto.deleteMany({});
      return productos;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al eliminar los productos');
    }
  }
}
