import { IsEmail, IsString, Min } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsString()
  correo: string;

  @IsString()
  @Min(8)
  contrasena: string;
}
