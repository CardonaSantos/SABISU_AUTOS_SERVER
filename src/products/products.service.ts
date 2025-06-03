import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  MethodNotAllowedException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNewProductDto } from './dto/create-productNew.dto';
import { MinimunStockAlertService } from 'src/minimun-stock-alert/minimun-stock-alert.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ImagenProducto, Prisma } from '@prisma/client';

import { createReadStream } from 'fs';
import * as csvParser from 'csv-parser';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,

    private readonly minimunStockAlert: MinimunStockAlertService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async create(dto: CreateNewProductDto) {
    try {
      console.log('llegando al server:', dto);

      console.log('los imagenes son: ', dto.imagenes);

      return await this.prisma.$transaction(async (tx) => {
        // 1) Crear el producto
        const newProduct = await tx.producto.create({
          data: {
            precioCostoActual: dto.precioCostoActual,
            codigoProducto: dto.codigoProducto,
            codigoProveedor: dto.codigoProveedor,
            nombre: dto.nombre,
            descripcion: dto.descripcion,
            categorias: {
              connect: dto.categorias?.map((id) => ({ id })) ?? [],
            },
          },
        });

        // 2) Crear los precios de venta
        const preciosCreados = await Promise.all(
          dto.precioVenta.map((precio) =>
            tx.precioProducto.create({
              data: {
                productoId: newProduct.id,
                precio,
                estado: 'APROBADO',
                tipo: 'ESTANDAR',
                creadoPorId: dto.creadoPorId,
                fechaCreacion: new Date(),
              },
            }),
          ),
        );

        // 3) Si viene stockMinimo, creamos el umbral global con tx
        if (dto.stockMinimo != null) {
          console.log(
            'entrando ala creacion de stock minimo, el producto a añadirle es: ',
            newProduct,
          );

          const minimoStock = await tx.stockThreshold.create({
            data: {
              productoId: newProduct.id,
              stockMinimo: dto.stockMinimo,
            },
          });
          console.log('Umbral creado:', minimoStock);
        }

        if (!dto.imagenes?.length) {
          console.log('No hay imágenes para subir o crear');
        } else {
          const promesas = dto.imagenes.map((base64) =>
            this.cloudinaryService.subirImagen(base64),
          );

          const resultados = await Promise.allSettled(promesas);

          for (let idx = 0; idx < resultados.length; idx++) {
            const res = resultados[idx];
            const imagenBase64 = dto.imagenes[idx];

            if (res.status === 'fulfilled') {
              // const url = res.value;
              const { url, public_id } = res.value;
              console.log(`OK: Imagen ${idx} subida → ${url}`);

              // await this.vincularProductoImagen(newProduct.id, url);
              // await this.vincularProductoImagen(tx, newProduct.id, url);
              await this.vincularProductoImagen(
                tx,
                newProduct.id,
                url,
                public_id,
              );
            } else {
              console.error(
                `Error subiendo imagen [${idx}] (${imagenBase64}):`,
                res.reason,
              );
            }
          }
        }
        return { newProduct, preciosCreados };
      });
    } catch (error) {
      console.error('Error al crear producto con threshold:', error);
      throw new InternalServerErrorException(
        'No se pudo crear el producto y su stock mínimo',
      );
    }
  }

  // products.service.ts

  // Cambia la firma:
  async vincularProductoImagen(
    tx: Prisma.TransactionClient,
    productoId: number,
    url: string,
    publicId: string,
    altTexto?: string,
  ) {
    return tx.imagenProducto.create({
      data: {
        productoId,
        url,
        public_id: publicId, // ahora lo guardas aquí
        altTexto,
      },
    });
  }

  async findAllProductsToSale(id: number) {
    try {
      const productos = await this.prisma.producto.findMany({
        include: {
          precios: {
            select: {
              id: true,
              precio: true,
            },
          },
          imagenesProducto: {
            select: {
              id: true,
              url: true,
            },
          },
          stock: {
            where: {
              cantidad: {
                gt: 0, // Solo traer productos con stock disponible
              },
              sucursalId: id,
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
          stockThreshold: {
            select: {
              id: true,
              stockMinimo: true,
            },
          },
          precios: {
            select: {
              id: true,
              precio: true,
              tipo: true,
              usado: true,
            },
          },
          categorias: {
            select: {
              id: true,
              nombre: true,
            },
          },
          stock: {
            include: {
              sucursal: {
                select: {
                  id: true,
                  nombre: true,
                },
              },
              entregaStock: {
                include: {
                  proveedor: {
                    select: {
                      nombre: true, // Solo seleccionamos el nombre del proveedor
                    },
                  },
                },
              },
            },
            where: {
              cantidad: {
                gt: 0, // Solo traer productos con stock disponible
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

  async findAllProductsToTransfer(id: number) {
    try {
      const productos = await this.prisma.producto.findMany({
        include: {
          stock: {
            where: {
              cantidad: {
                gt: 0, // Solo traer productos con stock disponible
              },
              sucursalId: id,
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
        orderBy: {
          actualizadoEn: 'desc',
        },
      });

      return productos;
    } catch (error) {
      console.error('Error en findAll productos:', error); // Proporcionar más contexto en el error
      throw new InternalServerErrorException('Error al obtener los productos');
    }
  }

  async productToEdit(id: number) {
    try {
      console.log('buscando un producto');

      const product = await this.prisma.producto.findUnique({
        where: {
          id,
        },
        include: {
          stockThreshold: true,
          categorias: true,
          imagenesProducto: {
            select: {
              id: true,
              url: true,
              public_id: true,
            },
          },
          precios: {
            select: {
              id: true,
              precio: true,
            },
          },
        },
      });

      return product;
    } catch (error) {
      console.error('Error en findAll productos:', error); // Proporcionar más contexto en el error
      throw new InternalServerErrorException('Error al obtener los productos');
    }
  }

  async productHistorialPrecios() {
    try {
      const historialPrecios = await this.prisma.historialPrecioCosto.findMany({
        include: {
          modificadoPor: {
            select: {
              nombre: true,
              id: true,
              rol: true,
              sucursal: {
                // Debes hacer include aquí
                select: {
                  nombre: true,
                  id: true,
                  direccion: true,
                },
              },
            },
          },
          producto: true, // Suponiendo que deseas incluir todo el producto
        },
        orderBy: {
          fechaCambio: 'desc',
        },
      });
      return historialPrecios;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error');
    }
  }

  async productToWarranty() {
    try {
      const products = await this.prisma.producto.findMany({
        orderBy: {
          creadoEn: 'desc',
        },
      });
      return products;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al encontrar productos');
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
    // 1) Traer producto antes de modificar (para historial)
    console.log(
      'Actualizando producto con ID:',
      id,
      'con datos:',
      updateProductDto,
    );

    const productoAnterior = await this.prisma.producto.findUnique({
      where: { id },
      include: { stockThreshold: true },
    });

    try {
      // 2) Abrimos la transacción
      const productoActualizado = await this.prisma.$transaction(async (tx) => {
        // 2.1) Actualizar datos básicos y categorías
        const productoUpdate = await tx.producto.update({
          where: { id },
          data: {
            codigoProducto: updateProductDto.codigoProducto,
            codigoProveedor: updateProductDto.codigoProveedor,
            nombre: updateProductDto.nombre,
            descripcion: updateProductDto.descripcion,
            precioCostoActual: Number(updateProductDto.precioCostoActual),
            categorias: {
              set: [],
              connect:
                updateProductDto.categorias?.map((cid) => ({ id: cid })) || [],
            },
          },
          include: {
            categorias: true,
            stockThreshold: true,
          },
        });

        // 2.2) Upsert de stockThreshold
        if (updateProductDto.stockMinimo !== undefined) {
          await tx.stockThreshold.upsert({
            where: { productoId: id },
            update: { stockMinimo: updateProductDto.stockMinimo },
            create: {
              producto: { connect: { id } },
              stockMinimo: updateProductDto.stockMinimo,
            },
          });
        }

        // 2.3) Update / create de precios
        for (const price of updateProductDto.precios || []) {
          if (price.id) {
            await tx.precioProducto.update({
              where: { id: price.id },
              data: { precio: price.precio },
            });
          } else {
            await tx.precioProducto.create({
              data: {
                estado: 'APROBADO',
                precio: price.precio,
                creadoPorId: updateProductDto.usuarioId,
                productoId: productoUpdate.id,
                tipo: 'ESTANDAR',
              },
            });
          }
        }

        // 2.4) Historial de cambio de precio de costo
        if (
          productoAnterior &&
          Number(productoAnterior.precioCostoActual) !==
            Number(productoUpdate.precioCostoActual)
        ) {
          await tx.historialPrecioCosto.create({
            data: {
              productoId: productoAnterior.id,
              precioCostoAnterior: Number(productoAnterior.precioCostoActual),
              precioCostoNuevo: Number(productoUpdate.precioCostoActual),
              modificadoPorId: updateProductDto.usuarioId,
            },
          });
        }

        // 2.5) Subida y vinculación de imágenes
        if (updateProductDto.imagenes?.length) {
          const promesas = updateProductDto.imagenes.map((base64) =>
            this.cloudinaryService.subirImagen(base64),
          );
          const resultados = await Promise.allSettled(promesas);

          for (let idx = 0; idx < resultados.length; idx++) {
            const res = resultados[idx];
            if (res.status === 'fulfilled') {
              const { url, public_id } = res.value;
              // Usamos tx para la vinculación
              await this.vincularProductoImagen(
                tx,
                productoUpdate.id,
                url,
                public_id,
              );
            } else {
              console.error(`Error subiendo imagen [${idx}]:`, res.reason);
            }
          }
        }

        return productoUpdate;
      });

      return productoActualizado;
    } catch (error) {
      console.error(error);
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

  async removeImageFromProduct(publicId: string, imageId: number) {
    console.log('el publicId es: ', publicId, ' y el imageId es: ', imageId);

    if (!imageId) {
      throw new MethodNotAllowedException(
        'No se ha proporcionado un ID de imagen',
      );
    }

    if (!publicId) {
      throw new MethodNotAllowedException(
        'No se ha proporcionado un ID de imagen',
      );
    }

    try {
      await this.prisma.imagenProducto.delete({
        where: {
          id: imageId,
        },
      });
      await this.cloudinaryService.BorrarImagen(publicId);
    } catch (error) {
      console.log(error);
    }
  }

  async productToCredit() {
    try {
      const products = await this.prisma.producto.findMany({
        select: {
          id: true,
          nombre: true,
          codigoProducto: true,
        },
      });
      return products;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Error al conseguir datos de los productos',
      );
    }
  }

  async loadCSVandImportProducts(
    filePath: string,
    dryRun = false,
  ): Promise<void> {
    const rows: any[] = [];
    // 1) Cargar todas las filas en memoria (puedes ir procesándolas fila a fila si el CSV es muy grande).
    const stream = createReadStream(filePath).pipe(
      csvParser({
        separator: ',',
        mapHeaders: ({ header }) => header.replace(/^\uFEFF/, '').trim(),
      }),
    );
    for await (const row of stream) {
      rows.push(row);
    }
    console.log(`Se leyeron ${rows.length} filas del CSV.`);

    // 2) Procesar cada fila
    for (const [index, row] of rows.entries()) {
      // ---------------------------------------------------
      // 2.1) Leer los campos del CSV y hacer trim donde convenga:
      // ---------------------------------------------------
      const codigoProducto = row['codigoProducto']?.trim();
      const nombre = row['nombre']?.trim();
      const descripcion = row['descripcion']?.trim() || null;
      const categoriasRaw = row['categorias']?.trim() || '';
      const preciosVentaRaw = row['preciosVenta']?.trim() || '';
      const precioCostoActual = parseFloat(row['precioCostoActual']) || null;
      const codigoProveedor = row['codigoProveedor']?.trim() || null;
      // El CSV trae “stockMinimo” (umbral), pero aquí no creamos StockThreshold: lo dejamos en stand-by.
      const stockMinimoCsv = parseInt(row['stockMinimo'], 10) || null;

      // ---------------------------------------------------
      // 2.2) Validar campos mínimos obligatorios:
      // ---------------------------------------------------
      if (!codigoProducto || !nombre) {
        console.log(
          `Fila ${index + 1} omitida: faltan “codigoProducto” o “nombre”.`,
        );
        continue;
      }

      // ---------------------------------------------------
      // 2.3) Dividir las categorías y hacer upsert (crear si no existe):
      // ---------------------------------------------------
      const categoryNames = categoriasRaw
        .split(',')
        .map((c: string) => c.trim())
        .filter((c: string) => c.length > 0);

      const categoryIds: number[] = [];
      for (const catName of categoryNames) {
        try {
          // Upsert: si ya existe, lo actualiza (pero no cambia nada), si no, lo crea.
          const categoria = await this.prisma.categoria.upsert({
            where: { nombre: catName },
            create: { nombre: catName },
            update: {},
          });
          categoryIds.push(categoria.id);
        } catch (e) {
          console.log(
            `Error subiendo categoría “${catName}” en fila ${index + 1}: ${e.message}`,
          );
        }
      }

      // ---------------------------------------------------
      // 2.4) En dryRun sólo registramos en logs qué haríamos y seguimos:
      // ---------------------------------------------------
      if (dryRun) {
        console.log(
          `[DryRun] Producto a crear: ${nombre} (${codigoProducto}), categorías: [${categoryNames.join(
            ', ',
          )}], precios: [${preciosVentaRaw}], costo: ${precioCostoActual}`,
        );
        continue;
      }

      // ---------------------------------------------------
      // 2.5) Crear el Producto en la base de datos:
      // ---------------------------------------------------
      let productoCreado;
      try {
        productoCreado = await this.prisma.producto.create({
          data: {
            codigoProducto,
            nombre,
            descripcion,
            precioCostoActual, // Puede ser null si no viene en el CSV
            codigoProveedor, // Puede ser null si no viene en el CSV
            // Conectar las categorías existentes/creadas:
            categorias: {
              connect: categoryIds.map((id) => ({ id })),
            },
            // NOTA: no creamos stockThreshold ni stock aquí porque el CSV no trae sucursal/fechas
          },
        });
        console.log(`✅ Producto creado: ${nombre} (ID ${productoCreado.id})`);
      } catch (e) {
        console.log(
          `❌ Error al crear Producto en fila ${index + 1}: ${e.message}`,
        );
        continue;
      }

      // ---------------------------------------------------
      // 2.6) Si el CSV trae “stockMinimo” y tienes una tabla StockThreshold, podrías:
      //     await prisma.stockThreshold.create({ data: { productoId: productoCreado.id, stockMinimo: stockMinimoCsv } });
      // ---------------------------------------------------
      // (Lo dejamos comentado porque no compartiste la definición de StockThreshold.)

      // ---------------------------------------------------
      // 2.7) Crear registros PrecioProducto para cada precio en “preciosVenta”:
      // ---------------------------------------------------
      const preciosArray = preciosVentaRaw
        .split(',')
        .map((p: string) => parseFloat(p.trim()))
        .filter((p: number) => !isNaN(p) && p > 0);

      for (const precio of preciosArray) {
        try {
          await this.prisma.precioProducto.create({
            data: {
              productoId: productoCreado.id,
              precio,
              estado: 'APROBADO', // o ‘APROBADO’ si quieres que quede disponible de una vez
              usado: false,
              tipo: 'ESTANDAR',
              // creadoPorId: null,     // si quieres registrar qué usuario lo puso, puedes pasar un ID aquí
            },
          });
        } catch (e) {
          console.log(
            `❌ Error al crear PrecioProducto para ${productoCreado.id} con precio ${precio}: ${e.message}`,
          );
        }
      }

      // ---------------------------------------------------
      // 2.8) (Opcional) Si tuvieras un stock inicial en CSV (ej: campo “cantidad” y “fechaIngreso”),
      //      aquí harías algo como:
      //
      // await prisma.stock.create({
      //   data: {
      //     productoId: productoCreado.id,
      //     cantidad: cantidadInicialCsv,
      //     costoTotal: cantidadInicialCsv * (precioCostoActual || 0),
      //     fechaIngreso: new Date(),         // o guardarlo desde el CSV si existe
      //     precioCosto: precioCostoActual,   // o un campo separado de “costo por unidad” si vienes del CSV
      //     sucursalId: tuSucursalPorDefecto,  // o un valor que venga en el CSV
      //   },
      // });
      //
      // Como no tenemos esos datos en tu CSV, lo omitimos. Si luego agregas “cantidad” y “sucursalId”,
      // saca esta sección del comentario y adapta los campos.
      // ---------------------------------------------------
    }

    console.log('📦 ¡Importación de productos finalizada!');
  }
}
