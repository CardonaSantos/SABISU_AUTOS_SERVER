import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcryptjs';
import { Rol } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService, ///DE LA DEPENDENCIA
  ) {}

  async validarUsuario(email: string, contraseña: string): Promise<any> {
    const usuario = await this.userService.findByGmail(email);

    if (usuario && (await bcrypt.compare(contraseña, usuario.contrasena))) {
      return usuario;
    }
    throw new UnauthorizedException('Usuario no autorizado');
  }

  // Generar el JWT sin usar estrategias avanzadas
  async login(email: string, contrasena: string) {
    try {
      const usuario = await this.validarUsuario(email, contrasena);
      const payload = {
        nombre: usuario.nombre,
        correo: usuario.correo,
        sub: usuario.id,
        rol: usuario.rol,
        activo: usuario.activo,
      };
      return {
        access_token: this.jwtService.sign(payload), // Genera el token JWT
      };
    } catch (error) {
      console.log(error);
    }
  }

  // Registrar un nuevo usuario con contraseñas hasheadas
  async register(createAuthDto: CreateAuthDto) {
    try {
      // Hasheamos la contraseña
      console.log('Los datos llegando son: ', createAuthDto);

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(createAuthDto.contrasena, salt);
      const { nombre, rol, correo } = createAuthDto;
      // Creamos el usuario
      const nuevoUsuario = await this.userService.create({
        nombre,
        contrasena: hashedPassword,
        rol,
        correo,
        activo: true,
      });

      //EL PAYLOAD SE PUEDE CREAR CUANDO YA TENEMOS EL USER
      const payload = {
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        sub: nuevoUsuario.id,
        rol: nuevoUsuario.rol,
        activo: nuevoUsuario.activo,
      };

      const token = this.jwtService.sign(payload);

      return {
        usuario: nuevoUsuario,
        access_token: token,
      };
    } catch (error) {
      console.log('EL ERROR ES: ', error);
    }
  }

  //====================================>
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
