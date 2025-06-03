import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientService } from 'src/client/client.service';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationToEmit } from 'src/web-sockets/Types/NotificationTypeSocket';
import { TipoNotificacion } from '@prisma/client';

@Injectable()
export class VentaService {
  //
  constructor(
    private readonly prisma: PrismaService,
    private readonly clienteService: ClientService, // Inyección del servicio Cliente
    private readonly notifications: NotificationService,
  ) {}

  // async createEx(createVentaDto: CreateVentaDto) {
  //   const {
  //     sucursalId,
  //     clienteId,
  //     productos,
  //     metodoPago,
  //     nombre,
  //     dpi,
  //     telefono,
  //     direccion,
  //     imei,
  //     iPInternet,
  //   } = createVentaDto;

  //   console.log(
  //     'LOS DATOS SEPARADOS DEL DTO ES: ',
  //     sucursalId,
  //     clienteId,
  //     productos,
  //     metodoPago,
  //     nombre,
  //     dpi,
  //     telefono,
  //     direccion,
  //     imei,
  //   );

  //   console.log('EL ID DEL SUCURSAL ES: ', sucursalId);

  //   console.log('EL IP ES: ', iPInternet);

  //   try {
  //     // 1. Crear o asociar cliente
  //     let cliente;
  //     if (clienteId) {
  //       // Cliente ya existe
  //       cliente = { connect: { id: clienteId } };
  //     } else if (nombre && telefono) {
  //       // Crear cliente nuevo
  //       const nuevoCliente = await this.clienteService.create({
  //         nombre,
  //         dpi,
  //         telefono,
  //         direccion,
  //         iPInternet,
  //       });
  //       cliente = { connect: { id: nuevoCliente.id } };

  //       console.log('EL NUEVO CLIENTE CREADO ES: ', nuevoCliente);
  //     } else {
  //       // Caso de cliente final (CF)
  //       cliente = undefined;
  //     }

  //     console.log('El nuevo cliente es: ', cliente);

  //     // 2. Validación de productos y precios
  //     const productosConsolidados = await Promise.all(
  //       productos.map(async (prod) => {
  //         const precioProducto = await this.prisma.precioProducto.findUnique({
  //           where: { id: prod.selectedPriceId, productoId: prod.productoId },
  //         });

  //         if (!precioProducto || precioProducto.usado) {
  //           throw new Error(
  //             `El precio no está disponible para el producto ${prod.productoId}`,
  //           );
  //         }

  //         return {
  //           ...prod,
  //           precioVenta: precioProducto.precio,
  //           tipoPrecio: precioProducto.tipo,
  //         };
  //       }),
  //     );

  //     // 3. Consolidar productos
  //     const productosConsolidadosFinales = productosConsolidados.reduce(
  //       (acc, prod) => {
  //         const existingProduct = acc.find(
  //           (p) => p.productoId === prod.productoId,
  //         );
  //         if (existingProduct) {
  //           existingProduct.cantidad += prod.cantidad;
  //         } else {
  //           acc.push(prod);
  //         }
  //         return acc;
  //       },
  //       [],
  //     );

  //     const stockUpdates = [];

  //     // 4. Verificar disponibilidad de stock y preparar actualizaciones
  //     for (const prod of productosConsolidadosFinales) {
  //       const producto = await this.prisma.producto.findUnique({
  //         where: { id: prod.productoId },
  //       });

  //       if (!producto) {
  //         throw new Error(`Producto con ID ${prod.productoId} no encontrado`);
  //       }

  //       // Obtener registros de stock en la sucursal
  //       const stocks = await this.prisma.stock.findMany({
  //         where: { productoId: producto.id, sucursalId },
  //         orderBy: { fechaIngreso: 'asc' },
  //       });

  //       let cantidadRestante = prod.cantidad;

  //       for (const stock of stocks) {
  //         if (cantidadRestante <= 0) break;

  //         if (stock.cantidad >= cantidadRestante) {
  //           stockUpdates.push({
  //             id: stock.id,
  //             cantidad: stock.cantidad - cantidadRestante,
  //           });
  //           cantidadRestante = 0;
  //         } else {
  //           stockUpdates.push({ id: stock.id, cantidad: 0 });
  //           cantidadRestante -= stock.cantidad;
  //         }
  //       }

  //       if (cantidadRestante > 0) {
  //         throw new InternalServerErrorException(
  //           `No hay suficiente stock para el producto ${producto.nombre}`,
  //         );
  //       }
  //     }

  //     // 5. Actualizar stock
  //     await this.prisma.$transaction(
  //       stockUpdates.map((stock) =>
  //         this.prisma.stock.update({
  //           where: { id: stock.id },
  //           data: { cantidad: stock.cantidad },
  //         }),
  //       ),
  //     );

  //     // 6. Calcular total de la venta
  //     const totalVenta = productosConsolidadosFinales.reduce(
  //       (total, prod) => total + prod.precioVenta * prod.cantidad,
  //       0,
  //     );

  //     // 7. Crear la venta con cliente y opción de IMEI
  //     const venta = await this.prisma.venta.create({
  //       data: {
  //         cliente,
  //         horaVenta: new Date(),
  //         totalVenta,
  //         imei,
  //         sucursal: { connect: { id: sucursalId } },
  //         productos: {
  //           create: productosConsolidadosFinales.map((prod) => ({
  //             producto: { connect: { id: prod.productoId } },
  //             cantidad: prod.cantidad,
  //             precioVenta: prod.precioVenta,
  //           })),
  //         },
  //       },
  //     });

  //     const saldo = await this.prisma.sucursalSaldo.update({
  //       where: {
  //         sucursalId: sucursalId,
  //       },
  //       data: {
  //         saldoAcumulado: {
  //           //PRISMA INCREMENTA UN CAMPO ACUMULATIVO
  //           increment: totalVenta,
  //         },
  //         totalIngresos: {
  //           increment: totalVenta,
  //         },
  //       },
  //     });

  //     console.log('El registro actualizado es: ', saldo);

  //     // 8. Marcar precios como usados si es necesario
  //     await Promise.all(
  //       productosConsolidadosFinales.map(async (prod) => {
  //         if (prod.tipoPrecio === 'CREADO_POR_SOLICITUD') {
  //           await this.prisma.precioProducto.delete({
  //             where: { id: prod.selectedPriceId },
  //           });
  //         }
  //       }),
  //     );

  //     // 9. Registro del pago
  //     const payM = await this.prisma.pago.create({
  //       data: {
  //         metodoPago,
  //         monto: venta.totalVenta,
  //         venta: { connect: { id: venta.id } },
  //       },
  //     });

  //     // Vincular el pago con la venta
  //     await this.prisma.venta.update({
  //       where: { id: venta.id },
  //       data: { metodoPago: { connect: { id: payM.id } } },
  //     });

  //     console.log('La venta hecha es: ', venta);
  //     return venta;
  //   } catch (error) {
  //     console.error(error);
  //     throw new InternalServerErrorException('Error al crear la venta');
  //   }
  // }

  async create(createVentaDto: CreateVentaDto) {
    const {
      sucursalId,
      clienteId,
      productos,
      metodoPago,
      nombre,
      dpi,
      telefono,
      direccion,
      imei,
      observaciones,
      usuarioId,
    } = createVentaDto;

    try {
      return await this.prisma.$transaction(async (tx) => {
        // Usuarios a notificar
        const usuariosNotif = await tx.usuario.findMany({
          where: { rol: { in: ['ADMIN', 'VENDEDOR'] } },
        });
        const usuariosNotifIds = usuariosNotif.map((u) => u.id);

        // Crear/vincular cliente
        let clienteConnect: { connect: { id: number } } | undefined;
        if (clienteId) {
          clienteConnect = { connect: { id: clienteId } };
        } else if (nombre && telefono) {
          const nuevoCliente = await tx.cliente.create({
            data: { nombre, dpi, telefono, direccion, observaciones },
          });
          clienteConnect = { connect: { id: nuevoCliente.id } };
        }

        // Validar precios y consolidar cantidades
        const validados = await Promise.all(
          productos.map(async (p) => {
            const precio = await tx.precioProducto.findUnique({
              where: { id: p.selectedPriceId },
            });
            if (!precio || precio.usado) {
              throw new Error(`Precio no válido para producto ${p.productoId}`);
            }
            return {
              productoId: p.productoId,
              cantidad: p.cantidad,
              precioVenta: precio.precio,
              tipoPrecio: precio.tipo,
              selectedPriceId: p.selectedPriceId,
            };
          }),
        );
        const consolidados = validados.reduce<typeof validados>((acc, cur) => {
          const e = acc.find((x) => x.productoId === cur.productoId);
          if (e) e.cantidad += cur.cantidad;
          else acc.push({ ...cur });
          return acc;
        }, []);

        // Ajuste FIFO de stock en la sucursal
        const stockUpdates: { id: number; cantidad: number }[] = [];
        for (const p of consolidados) {
          let restante = p.cantidad;
          const lotes = await tx.stock.findMany({
            where: { productoId: p.productoId, sucursalId },
            orderBy: { fechaIngreso: 'asc' },
          });
          for (const lote of lotes) {
            if (restante <= 0) break;
            const nuevo = Math.max(0, lote.cantidad - restante);
            stockUpdates.push({ id: lote.id, cantidad: nuevo });
            restante -= lote.cantidad;
          }
          if (restante > 0) {
            throw new Error(`Stock insuficiente para producto ${p.productoId}`);
          }
        }
        await Promise.all(
          stockUpdates.map((u) =>
            tx.stock.update({
              where: { id: u.id },
              data: { cantidad: u.cantidad },
            }),
          ),
        );

        // Notificar después de rebajar stock
        for (const p of consolidados) {
          const agg = await tx.stock.aggregate({
            where: { productoId: p.productoId },
            _sum: { cantidad: true },
          });
          const stockGlobal = agg._sum.cantidad ?? 0;

          const th = await tx.stockThreshold.findUnique({
            where: { productoId: p.productoId },
          });

          if (!th) continue;

          if (stockGlobal <= th.stockMinimo) {
            console.log('entrando a crear la notificacion...');
            const info = await tx.producto.findUnique({
              where: { id: p.productoId },
              select: { nombre: true },
            });

            for (const uId of usuariosNotifIds) {
              const existe = await tx.notificacion.findFirst({
                where: {
                  referenciaId: th.id,
                  tipoNotificacion: 'STOCK_BAJO',
                  notificacionesUsuarios: {
                    some: { usuarioId: uId },
                  },
                },
              });
              if (existe) continue;
              await this.notifications.createOneNotification(
                `El producto ${info.nombre} ha alcanzado stock mínimo (quedan ${stockGlobal} uds).`,
                usuarioId,
                uId,
                'STOCK_BAJO',
                th.id,
              );
            }
          }
        }

        // Crear la venta, pago y actualizar saldo
        const totalVenta = consolidados.reduce(
          (sum, x) => sum + x.precioVenta * x.cantidad,
          0,
        );
        const venta = await tx.venta.create({
          data: {
            usuario: { connect: { id: usuarioId } },
            cliente: clienteConnect,
            horaVenta: new Date(),
            totalVenta,
            imei,
            sucursal: { connect: { id: sucursalId } },
            productos: {
              create: consolidados.map((x) => ({
                producto: { connect: { id: x.productoId } },
                cantidad: x.cantidad,
                precioVenta: x.precioVenta,
              })),
            },
          },
        });
        await tx.sucursalSaldo.update({
          where: { sucursalId },
          data: {
            saldoAcumulado: { increment: totalVenta },
            totalIngresos: { increment: totalVenta },
          },
        });
        const pago = await tx.pago.create({
          data: {
            metodoPago: metodoPago || 'CONTADO',
            monto: totalVenta,
            venta: { connect: { id: venta.id } },
          },
        });
        await tx.venta.update({
          where: { id: venta.id },
          data: { metodoPago: { connect: { id: pago.id } } },
        });

        return venta;
      });
    } catch (e) {
      console.error('Error en createVenta:', e);
      throw new InternalServerErrorException('Error al crear la venta');
    }
  }

  async findAll() {
    try {
      const ventas = await this.prisma.venta.findMany({
        include: {
          cliente: true,
          metodoPago: true,
          productos: {
            include: {
              producto: true,
            },
          },
        },
        orderBy: {
          fechaVenta: 'desc',
        },
      });
      return ventas;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al obtener las ventas');
    }
  }

  async findAllSaleSucursal(id: number) {
    try {
      const ventas = await this.prisma.venta.findMany({
        where: {
          sucursalId: id,
        },
        include: {
          cliente: true,
          metodoPago: true,
          productos: {
            include: {
              producto: true,
            },
          },
        },
        orderBy: {
          fechaVenta: 'desc',
        },
      });
      return ventas;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al obtener las ventas');
    }
  }

  async findOneSale(id: number) {
    try {
      const ventas = await this.prisma.venta.findUnique({
        where: {
          id: id,
        },

        include: {
          cliente: true,
          metodoPago: true,
          sucursal: {
            select: {
              direccion: true,
              nombre: true,
              id: true,
              telefono: true,
              pbx: true,
            },
          },
          productos: {
            include: {
              producto: true,
            },
            orderBy: {
              precioVenta: 'desc',
            },
          },
        },
      });
      return ventas;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al obtener las ventas');
    }
  }

  async update(id: number, updateVentaDto: UpdateVentaDto) {
    try {
      const venta = await this.prisma.venta.update({
        where: { id },
        data: {
          productos: {
            connect: updateVentaDto.productos.map((prod) => ({
              id: prod.productoId,
            })),
          },
        },
      });

      if (!venta) {
        throw new NotFoundException(`Venta con ID ${id} no encontrada`);
      }
      return venta;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al actualizar la venta');
    }
  }

  async getSalesToCashRegist(sucursalId: number, usuarioId: number) {
    try {
      const salesWithoutCashRegist = await this.prisma.venta.findMany({
        orderBy: {
          fechaVenta: 'desc',
        },
        where: {
          sucursalId: sucursalId,
          registroCajaId: null,
          usuarioId: usuarioId,
        },
        include: {
          productos: {
            select: {
              cantidad: true,
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
      });

      if (!salesWithoutCashRegist) {
        throw new BadRequestException('Error al conseguir registros');
      }

      return salesWithoutCashRegist;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error al conseguir registros de ventas',
      );
    }
  }

  async removeAll() {
    try {
      const ventas = await this.prisma.venta.deleteMany({});
      return ventas;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al eliminar las ventas');
    }
  }

  async remove(id: number) {
    try {
      const venta = await this.prisma.venta.delete({
        where: { id },
      });
      if (!venta) {
        throw new NotFoundException(`Venta con ID ${id} no encontrada`);
      }
      return venta;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al eliminar la venta');
    }
  }

  //ENCONTRAR SOLO VENTAS DE UN SOLO CLIENTE
  async findAllSaleCustomer(customerId: number) {
    try {
      const ventas = await this.prisma.venta.findMany({
        where: {
          clienteId: customerId,
        },
        include: {
          cliente: true,
          metodoPago: true,
          productos: {
            include: {
              producto: true,
            },
          },
        },
        orderBy: {
          fechaVenta: 'desc',
        },
      });
      return ventas;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al obtener las ventas');
    }
  }
}
