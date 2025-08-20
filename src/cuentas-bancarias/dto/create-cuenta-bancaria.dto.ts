import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class CreateCuentaBancariaDto {
  @IsString()
  @Length(2, 50)
  banco!: string;

  @IsString()
  @Length(2, 50) // puede contener letras/números
  numero!: string;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  alias?: string;

  @IsOptional()
  @IsBoolean()
  activa?: boolean; // por defecto true si no se manda
}
