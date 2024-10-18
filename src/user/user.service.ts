import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = await this.prisma.usuario.create({
        data: createUserDto,
      });
      return newUser;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('Error al crear el usuario');
    }
  }

  async findByGmail(email: string) {
    try {
      const user = await this.prisma.usuario.findUnique({
        where: {
          correo: email,
        },
      });

      if (!user) {
        throw new InternalServerErrorException('Error');
      }

      return user;
    } catch (error) {
      console.log(error);
      throw new BadRequestException('error al encontrar usuario');
    }
  }

  //Encontrar usuarios simples
  async findAll() {
    try {
      const users = await this.prisma.usuario.findMany({});
      return users;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al encontrar usuarios');
    }
  }

  //ENCONTRAR SIMPLE USER
  async findOne(id: number) {
    try {
      const user = await this.prisma.usuario.findUnique({
        where: { id },
      });
      return user;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al encontrar usuarios');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const userToUpdate = await this.prisma.usuario.update({
        where: { id },
        data: updateUserDto,
      });
      return userToUpdate;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al actualizar usuario');
    }
  }

  async remove(id: number) {
    try {
      const userToDelete = await this.prisma.usuario.delete({
        where: { id },
      });
      return userToDelete;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al actualizar usuario');
    }
  }

  async removeAllUsers() {
    try {
      const usersToDelete = await this.prisma.usuario.deleteMany({});
      return usersToDelete;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error al eliminar usuarios');
    }
  }
}
