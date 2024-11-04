import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTicketDto: CreateTicketDto) {
    try {
      const nuevoModeloTicket = await this.prisma.ticketSorteo.create({
        data: {
          descripcionSorteo: createTicketDto.descripcionSorteo,
          // fechaInicio: createTicketDto.fechaInicio,
          // fechaFinal: createTicketDto.fechaFinal,
          estado: 'ACTIVO',
        },
      });

      console.log('El ticket de evento es: ', nuevoModeloTicket);

      return nuevoModeloTicket;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al crear modelo de ticket');
    }
  }

  async findAll() {
    try {
      const tickets = await this.prisma.ticketSorteo.findMany({
        orderBy: {
          creadoEn: 'desc',
        },
      });
      return tickets;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al encontrar tickets');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  async updateTicketModelo(id: number, updateTicketDto: UpdateTicketDto) {
    try {
      console.log('La data llegando al update es: ', updateTicketDto);

      const modeloCambiado = await this.prisma.ticketSorteo.update({
        where: {
          id,
        },
        data: {
          descripcionSorteo: updateTicketDto.descripcionSorteo,
          estado: updateTicketDto.estado,
        },
      });

      return modeloCambiado;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        'Error al actualizar registro de modelo ticket',
      );
    }
  }

  async removeAll() {
    try {
      const tickets = await this.prisma.ticketSorteo.deleteMany({});
      return tickets;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Erro');
    }
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
