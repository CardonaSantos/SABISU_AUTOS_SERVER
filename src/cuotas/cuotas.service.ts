import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCuotaDto } from './dto/create-cuota.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateVentaCuotaDto } from './dto/update-cuota.dto';
import { CreateVentaCuotaDto } from './dto/create-ventacuota.dto';
import { CreatePlantillaComprobanteDto } from './dto/plantilla-comprobante.dt';
import { CuotaDto } from './dto/registerNewPay';
import { CloseCreditDTO } from './dto/close-credit.dto';
import { CreditoRegistro, Testigo } from './TypeCredit';

@Injectable()
export class CuotasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createVentaCuotaDto: CreateVentaCuotaDto) {
    try {
      console.log('Los datos entrantes son: ', createVentaCuotaDto);

      // 1. Consolidar productos para evitar duplicados
      const productosConsolidados = createVentaCuotaDto.productos.reduce(
        (acc, prod) => {
          const existingProduct = acc.find(
            (p) => p.productoId === prod.productoId,
          );
          if (existingProduct) {
            existingProduct.cantidad += prod.cantidad;
          } else {
            acc.push(prod);
          }
          return acc;
        },
        [],
      );

      console.log('Productos consolidados: ', productosConsolidados);

      // 2. Verificar disponibilidad de stock
      const stockUpdates = [];
      for (const prod of productosConsolidados) {
        const stocks = await this.prisma.stock.findMany({
          where: {
            productoId: prod.productoId,
            sucursalId: createVentaCuotaDto.sucursalId,
          },
          orderBy: { fechaIngreso: 'asc' },
        });

        let cantidadRestante = prod.cantidad;

        for (const stock of stocks) {
          if (cantidadRestante <= 0) break;

          if (stock.cantidad >= cantidadRestante) {
            stockUpdates.push({
              id: stock.id,
              cantidad: stock.cantidad - cantidadRestante,
            });
            cantidadRestante = 0;
          } else {
            stockUpdates.push({ id: stock.id, cantidad: 0 });
            cantidadRestante -= stock.cantidad;
          }
        }

        if (cantidadRestante > 0) {
          throw new Error(
            `No hay suficiente stock para el producto ${prod.productoId}`,
          );
        }
      }

      console.log('Actualizaciones de stock: ', stockUpdates);

      // 3. Actualizar stock en la base de datos
      await this.prisma.$transaction(
        stockUpdates.map((stock) =>
          this.prisma.stock.update({
            where: { id: stock.id },
            data: { cantidad: stock.cantidad },
          }),
        ),
      );

      // 4. Crear la venta (productos se crean aquí para evitar duplicados)
      const venta = await this.prisma.venta.create({
        data: {
          clienteId: Number(createVentaCuotaDto.clienteId),
          sucursalId: Number(createVentaCuotaDto.sucursalId),
          totalVenta: Number(createVentaCuotaDto.totalVenta),
          productos: {
            create: productosConsolidados.map((prod) => ({
              producto: { connect: { id: prod.productoId } },
              cantidad: prod.cantidad,
              precioVenta: prod.precioVenta,
            })),
          },
        },
      });

      console.log('La venta creada es: ', venta);

      // 5. Registrar el pago inicial
      const pago = await this.prisma.pago.create({
        data: {
          ventaId: venta.id,
          monto: createVentaCuotaDto.cuotaInicial,
          metodoPago: 'OTRO',
          fechaPago: new Date(),
        },
      });

      console.log('El pago inicial registrado es: ', pago);

      // 6. Crear el registro de crédito (VentaCuota)
      const ventaCuota = await this.prisma.ventaCuota.create({
        data: {
          clienteId: Number(createVentaCuotaDto.clienteId),
          usuarioId: Number(createVentaCuotaDto.usuarioId),
          sucursalId: Number(createVentaCuotaDto.sucursalId),
          totalVenta: Number(createVentaCuotaDto.totalVenta),
          cuotaInicial: Number(createVentaCuotaDto.cuotaInicial),
          cuotasTotales: Number(createVentaCuotaDto.cuotasTotales),
          fechaInicio: new Date(createVentaCuotaDto.fechaInicio),
          diasEntrePagos: Number(createVentaCuotaDto.diasEntrePagos),
          interes: Number(createVentaCuotaDto.interes),
          estado: createVentaCuotaDto.estado,
          dpi: createVentaCuotaDto.dpi,
          ventaId: venta.id,
          montoTotalConInteres: createVentaCuotaDto.montoTotalConInteres,
          testigos: createVentaCuotaDto.testigos ?? null,
          fechaContrato: createVentaCuotaDto.fechaContrato
            ? new Date(createVentaCuotaDto.fechaContrato)
            : null,
          montoVenta: Number(createVentaCuotaDto.montoVenta),
          garantiaMeses: Number(createVentaCuotaDto.garantiaMeses),
          totalPagado: Number(createVentaCuotaDto.cuotaInicial),
        },
      });

      console.log('El registro de venta a crédito es: ', ventaCuota);

      console.log('Incrementando saldo');

      console.log(
        'El saldo a incrementar es: ',
        createVentaCuotaDto.totalVenta,
      );

      //INCREMENTAR EL SALDO

      console.log('EL ID DE LA SUCURSAL ES: ', createVentaCuotaDto.sucursalId);
      const sucursal = await this.prisma.sucursal.findUnique({
        where: {
          id: createVentaCuotaDto.sucursalId,
        },
      });
      console.log('La sucursal es: ', sucursal);

      const saldos = await this.prisma.sucursalSaldo.update({
        where: {
          sucursalId: createVentaCuotaDto.sucursalId,
        },
        data: {
          saldoAcumulado: {
            increment: createVentaCuotaDto.totalVenta,
          },
          totalIngresos: {
            increment: createVentaCuotaDto.totalVenta,
          },
        },
      });
      console.log('Incrementando saldo', saldos);

      return ventaCuota;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error al crear el registro de crédito');
    }
  }

  async createPlantilla(
    createPlantillaComprobanteDto: CreatePlantillaComprobanteDto,
  ) {
    try {
      const plantilla = await this.prisma.plantillaComprobante.create({
        data: {
          nombre: createPlantillaComprobanteDto.nombre,
          texto: createPlantillaComprobanteDto.texto,
          sucursalId: createPlantillaComprobanteDto.sucursalId || null,
        },
      });
      return plantilla;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error');
    }
  }

  async registerNewPay(createCuotaDto: CuotaDto) {
    try {
      // 1. Crear el registro del pago
      const newRegist = await this.prisma.cuota.create({
        data: {
          ventaCuotaId: createCuotaDto.ventaCuotaId,
          monto: createCuotaDto.monto,
          estado: createCuotaDto.estado,
          usuarioId: createCuotaDto.usuarioId,
          comentario: createCuotaDto.comentario,
        },
      });

      // 2. Actualizar el total pagado en la VentaCuota
      const ventaCuotaActualizada = await this.prisma.ventaCuota.update({
        where: {
          id: createCuotaDto.ventaCuotaId,
        },
        data: {
          totalPagado: {
            increment: createCuotaDto.monto,
          },
        },
        include: {
          venta: true, // Incluir la venta asociada
        },
      });

      // 3. Actualizar el totalVenta en la Venta asociada (si existe)
      if (ventaCuotaActualizada.venta) {
        await this.prisma.venta.update({
          where: {
            id: ventaCuotaActualizada.venta.id, // Usar la relación directa con Venta
          },
          data: {
            totalVenta: {
              increment: createCuotaDto.monto,
            },
          },
        });
      }

      // 4. Verificar si el crédito está completamente pagado
      // if (
      //   ventaCuotaActualizada.totalPagado + createCuotaDto.monto >=
      //   ventaCuotaActualizada.totalVenta
      // ) {
      //   await this.prisma.ventaCuota.update({
      //     where: { id: createCuotaDto.ventaCuotaId },
      //     data: { estado: 'PAGADA' },
      //   });
      // }

      return newRegist;
    } catch (error) {
      console.error('Error en registerNewPay:', error);
      throw new BadRequestException('Error al registrar pago de cuota');
    }
  }

  async getCredutsWithoutPaying() {
    const credits = await this.prisma.ventaCuota.findMany({
      where: {
        estado: {
          notIn: ['CANCELADA', 'COMPLETADA'],
        },
      },
      orderBy: {
        creadoEn: 'desc',
      },
      include: {
        cuotas: {
          select: {
            id: true,
            creadoEn: true,
            estado: true,
            monto: true,
            fechaPago: true,
          },
        },
        cliente: {
          select: {
            id: true,
            nombre: true,
          },
        },
        // productos: {
        //   orderBy: {
        //     precioVenta: 'desc',
        //   },
        //   include: {
        //     producto: {
        //       select: {
        //         id: true,
        //         nombre: true,
        //         codigoProducto: true,
        //       },
        //     },
        //   },
        // },
        sucursal: {
          select: {
            id: true,
            nombre: true,
            direccion: true,
          },
        },
        usuario: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });
    return credits;
  }

  async getPlantillas() {
    try {
      const plantillas = await this.prisma.plantillaComprobante.findMany({
        orderBy: {
          creadoEn: 'desc',
        },
      });
      return plantillas;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al conseguir la plantilla');
    }
  }

  async getAllCredits(): Promise<CreditoRegistro[]> {
    try {
      const credits = await this.prisma.ventaCuota.findMany({
        orderBy: {
          creadoEn: 'desc',
        },
        include: {
          cliente: {
            select: {
              id: true,
              nombre: true,
              telefono: true,
              direccion: true,
              dpi: true,
            },
          },
          sucursal: {
            select: {
              id: true,
              nombre: true,
              direccion: true,
            },
          },
          usuario: {
            select: {
              id: true,
              nombre: true,
            },
          },
          cuotas: {
            select: {
              id: true,
              creadoEn: true,
              estado: true,
              fechaPago: true,
              monto: true,
              comentario: true,
              usuario: {
                select: {
                  id: true,
                  nombre: true,
                },
              },
            },
          },
          venta: {
            include: {
              productos: {
                include: {
                  producto: {
                    select: {
                      id: true,
                      nombre: true,
                      codigoProducto: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Transformar los datos
      const formattedCredits: CreditoRegistro[] = credits.map((credit) => ({
        id: credit.id,
        clienteId: credit.clienteId,
        usuarioId: credit.usuarioId,
        sucursalId: credit.sucursalId,
        totalVenta: credit.totalVenta,
        cuotaInicial: credit.cuotaInicial,
        cuotasTotales: credit.cuotasTotales,
        fechaInicio: credit.fechaInicio.toISOString(),
        estado: credit.estado,
        creadoEn: credit.creadoEn.toISOString(),
        actualizadoEn: credit.actualizadoEn.toISOString(),
        dpi: credit.cliente.dpi,
        testigos: Array.isArray(credit.testigos)
          ? (credit.testigos as unknown as Testigo[])
          : [],
        fechaContrato: credit.fechaContrato.toISOString(),
        montoVenta: credit.montoVenta,
        garantiaMeses: credit.garantiaMeses,
        totalPagado: credit.totalPagado,
        cliente: credit.cliente,
        productos:
          credit.venta?.productos.map((vp) => ({
            id: vp.id,
            ventaId: vp.ventaId,
            productoId: vp.productoId,
            cantidad: vp.cantidad,
            creadoEn: vp.creadoEn.toISOString(),
            precioVenta: vp.precioVenta,
            producto: {
              id: vp.producto.id,
              nombre: vp.producto.nombre,
              codigoProducto: vp.producto.codigoProducto,
            },
          })) || [],
        sucursal: credit.sucursal,
        usuario: credit.usuario,
        cuotas: credit.cuotas.map((cuota) => ({
          id: cuota.id,
          creadoEn: cuota.creadoEn.toISOString(),
          estado: cuota.estado,
          fechaPago: cuota.fechaPago?.toISOString() || null,
          monto: cuota.monto,
          comentario: cuota.comentario,
          usuario: cuota.usuario
            ? {
                id: cuota.usuario.id,
                nombre: cuota.usuario.nombre,
              }
            : null,
        })),
        diasEntrePagos: credit.diasEntrePagos,
        interes: credit.interes,
        comentario: credit.comentario,
        montoTotalConInteres: credit.montoTotalConInteres,
      }));

      return formattedCredits;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error al recuperar los créditos');
    }
  }

  async getPlantilla(id: number) {
    try {
      const plantilla = await this.prisma.plantillaComprobante.findUnique({
        where: {
          id,
        },
      });
      return plantilla.texto;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al conseguir la plantilla');
    }
  }

  async getPlantillaToEdit(id: number) {
    try {
      const plantilla = await this.prisma.plantillaComprobante.findUnique({
        where: {
          id,
        },
      });
      return plantilla;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al conseguir la plantilla');
    }
  }

  async getCuota(id: number): Promise<{
    id: number;
    fechaContrato: string;
    cliente: {
      id: number;
      nombre: string;
      telefono: string;
      direccion: string;
      dpi: string;
    };
    usuario: {
      id: number;
      nombre: string;
    };
    testigos: {
      nombre: string;
      telefono: string;
      direccion: string;
    }[];
    sucursal: {
      id: number;
      nombre: string;
      direccion: string;
    };
    productos: {
      id: number;
      ventaId: number;
      productoId: number;
      cantidad: number;
      creadoEn: string;
      precioVenta: number;
      producto: {
        id: number;
        nombre: string;
        codigoProducto: string;
      };
    }[];
    montoVenta: number;
    cuotaInicial: number;
    cuotasTotales: number;
    garantiaMeses: number;
    dpi: string;
    diasEntrePagos: number;
    interes: number;
    totalVenta: number;
    montoTotalConInteres: number;
    totalPagado: number;

    //-----------------
    // id, // Código único del contrato
    // fechaContrato, // Fecha del contrato
    // cliente, // Información del cliente
    // usuario, // Información del vendedor
    // testigos, // Lista de testigos
    // sucursal, // Sucursal involucrada
    // productos, // Lista de productos vendidos
    // montoVenta, // Monto total de la venta
    // cuotaInicial, // Pago inicial
    // cuotasTotales, // Número total de cuotas
    // garantiaMeses, // Meses de garantía
    // dpi, // DPI del cliente
    // diasEntrePagos,
    // interes,
    // totalVenta,
  }> {
    try {
      const cuota = await this.prisma.ventaCuota.findUnique({
        where: {
          id,
        },
        include: {
          cliente: {
            select: {
              id: true,
              nombre: true,
              telefono: true,
              direccion: true,
              dpi: true,
            },
          },
          sucursal: {
            select: {
              id: true,
              nombre: true,
              direccion: true,
            },
          },
          usuario: {
            select: {
              id: true,
              nombre: true,
            },
          },
          venta: {
            include: {
              productos: {
                include: {
                  producto: {
                    select: {
                      id: true,
                      nombre: true,
                      codigoProducto: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!cuota) {
        throw new Error('No se encontró la cuota solicitada');
      }

      return {
        id: cuota.id,
        fechaContrato: cuota.fechaContrato.toISOString(),
        cliente: {
          id: cuota.cliente.id,
          nombre: cuota.cliente.nombre,
          telefono: cuota.cliente.telefono,
          direccion: cuota.cliente.direccion,
          dpi: cuota.cliente.dpi,
        },
        usuario: {
          id: cuota.usuario.id,
          nombre: cuota.usuario.nombre,
        },
        testigos: Array.isArray(cuota.testigos)
          ? (cuota.testigos as {
              nombre: string;
              telefono: string;
              direccion: string;
            }[])
          : [],
        sucursal: {
          id: cuota.sucursal.id,
          nombre: cuota.sucursal.nombre,
          direccion: cuota.sucursal.direccion,
        },
        productos:
          cuota.venta?.productos.map((vp) => ({
            id: vp.id,
            ventaId: vp.ventaId,
            productoId: vp.productoId,
            cantidad: vp.cantidad,
            creadoEn: vp.creadoEn.toISOString(),
            precioVenta: vp.precioVenta,
            producto: {
              id: vp.producto.id,
              nombre: vp.producto.nombre,
              codigoProducto: vp.producto.codigoProducto,
            },
          })) || [],
        montoVenta: cuota.montoVenta,
        cuotaInicial: cuota.cuotaInicial,
        cuotasTotales: cuota.cuotasTotales,
        garantiaMeses: cuota.garantiaMeses,
        dpi: cuota.dpi,
        diasEntrePagos: cuota.diasEntrePagos,
        interes: cuota.interes,
        totalVenta: cuota.totalVenta,
        montoTotalConInteres: cuota.montoTotalConInteres,
        totalPagado: cuota.totalPagado,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error al recuperar los datos de la cuota');
    }
  }

  async deleteAll() {
    try {
      const regists = await this.prisma.ventaCuota.deleteMany({});
      return regists;
    } catch (error) {
      console.log(error);

      throw new BadRequestException('Error');
    }
  }

  async deleteAllPlantillas() {
    try {
      const regists = await this.prisma.plantillaComprobante.deleteMany({});
      return regists;
    } catch (error) {
      console.log(error);

      throw new BadRequestException('Error');
    }
  }

  async deleteOnePlaceholder(id: number) {
    try {
      const response = await this.prisma.plantillaComprobante.delete({
        where: {
          id,
        },
      });
      return response;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al eliminar registro');
    }
  }

  async updatePlantilla(
    id: number,
    createPlantillaComprobanteDto: CreatePlantillaComprobanteDto,
  ) {
    console.log('los datos son: ', createPlantillaComprobanteDto);

    try {
      const placeholderToUpdate = await this.prisma.plantillaComprobante.update(
        {
          where: {
            id,
          },
          data: {
            nombre: createPlantillaComprobanteDto.nombre,
            texto: createPlantillaComprobanteDto.texto,
          },
        },
      );

      return placeholderToUpdate;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al actualizar registro');
    }
  }

  async closeCreditRegist(id: number, closeCreditDto: CloseCreditDTO) {
    try {
      const creditToClose = await this.prisma.ventaCuota.update({
        where: {
          id,
        },
        data: {
          estado: closeCreditDto.estado,
          comentario: closeCreditDto.comentario,
        },
      });
      return creditToClose;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al actualizar y cerrar credito');
    }
  }

  async getComprobanteCuota(id: number): Promise<any> {
    try {
      const cuota = await this.prisma.cuota.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          monto: true,
          fechaPago: true,
          estado: true,
          comentario: true,
          usuario: {
            select: {
              id: true,
              nombre: true,
              rol: true,
            },
          },
          ventaCuota: {
            select: {
              cliente: {
                select: {
                  id: true,
                  nombre: true,
                  dpi: true,
                },
              },
              venta: {
                select: {
                  productos: {
                    select: {
                      producto: {
                        select: {
                          id: true,
                          nombre: true,
                          descripcion: true,
                          codigoProducto: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!cuota) {
        throw new BadRequestException('Cuota no encontrada');
      }

      // Transformar los datos para facilitar su uso en el front
      return {
        id: cuota.id,
        monto: cuota.monto,
        fechaPago: cuota.fechaPago,
        estado: cuota.estado,
        comentario: cuota.comentario,
        usuario: cuota.usuario,
        cliente: cuota.ventaCuota?.cliente,
        productos:
          cuota.ventaCuota?.venta?.productos.map((p) => ({
            id: p.producto.id,
            nombre: p.producto.nombre,
            descripcion: p.producto.descripcion,
            codigoProducto: p.producto.codigoProducto,
          })) || [],
      };
    } catch (error) {
      console.error('Error al conseguir comprobante de cuota', error);
      throw new BadRequestException('Error al conseguir comprobante');
    }
  }

  async deleteAllCreditosPrueba() {
    try {
      const registrosEliminados = await this.prisma.ventaCuota.deleteMany({});
      return registrosEliminados;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al eliminar');
    }
  }
}
