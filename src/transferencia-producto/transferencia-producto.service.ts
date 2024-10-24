import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTransferenciaProductoDto } from './dto/create-transferencia-producto.dto';
import { UpdateTransferenciaProductoDto } from './dto/update-transferencia-producto.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransferenciaProductoService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTransferenciaProductoDto: CreateTransferenciaProductoDto) {
    return 'This action adds a new transferenciaProducto';
  }

  async transferirProducto(dto: CreateTransferenciaProductoDto) {
    const {
      productoId,
      cantidad,
      sucursalOrigenId,
      sucursalDestinoId,
      usuarioEncargadoId,
    } = dto;

    // Verificar que hay suficiente stock en la sucursal de origen sumando todos los registros disponibles
    const stockOrigenes = await this.prisma.stock.findMany({
      where: { productoId, sucursalId: sucursalOrigenId },
      orderBy: { fechaIngreso: 'asc' }, // Ordenar por fechaIngreso para aplicar FIFO
    });

    // Calcular la cantidad total disponible en la sucursal de origen
    const cantidadTotalStockOrigen = stockOrigenes.reduce(
      (total, stock) => total + stock.cantidad,
      0,
    );

    if (cantidadTotalStockOrigen < cantidad) {
      throw new Error('Stock insuficiente en la sucursal de origen');
    }

    let cantidadRestante = cantidad;

    // Actualizar el stock de la sucursal de origen utilizando FIFO
    for (const stock of stockOrigenes) {
      if (cantidadRestante === 0) break;

      if (stock.cantidad <= cantidadRestante) {
        // Si el stock actual es menor o igual a la cantidad requerida, restar todo el stock
        await this.prisma.stock.update({
          where: { id: stock.id },
          data: { cantidad: 0 }, // Consumir todo este registro de stock
        });
        cantidadRestante -= stock.cantidad;
      } else {
        // Si el stock actual es mayor a la cantidad requerida, restar solo lo necesario
        await this.prisma.stock.update({
          where: { id: stock.id },
          data: { cantidad: stock.cantidad - cantidadRestante },
        });
        cantidadRestante = 0; // Ya no queda más cantidad por transferir
      }
    }

    // Buscar o crear el stock en la sucursal de destino
    const stockDestino = await this.prisma.stock.findFirst({
      where: { productoId, sucursalId: sucursalDestinoId },
    });

    if (stockDestino) {
      // Si ya existe el stock del producto en la sucursal destino, sumamos la cantidad
      await this.prisma.stock.update({
        where: { id: stockDestino.id },
        data: { cantidad: stockDestino.cantidad + cantidad },
      });
    } else {
      // Si no existe, creamos un nuevo registro de stock en la sucursal destino
      await this.prisma.stock.create({
        data: {
          productoId,
          sucursalId: sucursalDestinoId,
          cantidad,
          precioCosto: stockOrigenes[0].precioCosto, // Usar el precioCosto del primer stock FIFO
          costoTotal: stockOrigenes[0].precioCosto * cantidad,
          fechaIngreso: new Date(),
        },
      });
    }

    // Registrar la transferencia en la tabla TransferenciaProducto
    await this.prisma.transferenciaProducto.create({
      data: {
        productoId,
        cantidad,
        sucursalOrigenId,
        sucursalDestinoId,
        usuarioEncargadoId,
        fechaTransferencia: new Date(),
      },
    });

    return { message: 'Transferencia realizada con éxito' };
  }

  findAll() {
    return `This action returns all transferenciaProducto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transferenciaProducto`;
  }

  async findAllMytranslates(id: number) {
    try {
      const translates = await this.prisma.transferenciaProducto.findMany({
        where: {
          sucursalOrigenId: id,
        },
        include: {
          producto: true,
          usuarioEncargado: true,
          sucursalDestino: true,
        },
      });

      console.log(translates);

      return translates;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al conseguir registros');
    }
  }

  update(
    id: number,
    updateTransferenciaProductoDto: UpdateTransferenciaProductoDto,
  ) {
    return `This action updates a #${id} transferenciaProducto`;
  }

  remove(id: number) {
    return `This action removes a #${id} transferenciaProducto`;
  }

  async removeAll() {
    try {
      const borrados = await this.prisma.transferenciaProducto.deleteMany({});
      return borrados;
    } catch (error) {
      console.log(error);
    }
  }
}
