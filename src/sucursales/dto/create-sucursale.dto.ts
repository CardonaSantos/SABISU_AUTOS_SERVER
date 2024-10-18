import { TipoSucursal } from '@prisma/client';
import {
  IsString,
  IsOptional,
  IsInt,
  IsPhoneNumber,
  IsEnum,
} from 'class-validator';

export class CreateSucursaleDto {
  @IsString()
  nombre: string;

  @IsEnum(TipoSucursal)
  tipoSucursal: TipoSucursal;

  @IsString()
  direccion: string;

  @IsPhoneNumber(null) // Puedes especificar el código de país si es necesario, por ejemplo, 'GT' para Guatemala
  telefono: string;

  @IsOptional()
  @IsInt()
  departamentoId?: number;

  @IsOptional()
  @IsInt()
  municipioId?: number;
}
