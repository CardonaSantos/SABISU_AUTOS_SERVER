import {
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsString,
  IsISO8601,
  Min,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  // CategoriaMovimiento,
  GastoOperativoTipo,
  // TipoMovimientoCaja,
} from '@prisma/client';

export class CreateMovimientoCajaDto {
  // @IsEnum(TipoMovimientoCaja, { message: 'Tipo inválido' })
  // tipo: TipoMovimientoCaja;

  // @IsOptional()
  // @IsEnum(CategoriaMovimiento, { message: 'Categoría inválida' })
  // categoria?: CategoriaMovimiento;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Monto debe ser un número' })
  @Min(0, { message: 'Monto debe ser mayor o igual a 0' })
  monto?: number;

  // Solo aplica si categoria === DEPOSITO_CIERRE
  @ValidateIf((o) => o.categoria === 'DEPOSITO_CIERRE')
  @IsBoolean({ message: 'depositarTodo debe ser un booleano' })
  depositarTodo?: boolean;

  @Type(() => Number)
  @IsNumber({}, { message: 'usuarioId debe ser un número' })
  usuarioId: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'sucursalId debe ser un número' })
  sucursalId?: number;

  @IsOptional()
  @IsString({ message: 'descripcion debe ser texto' })
  descripcion?: string;

  @IsOptional()
  @IsString({ message: 'referencia debe ser texto' })
  referencia?: string;

  @IsOptional()
  @IsString({ message: 'banco debe ser texto' })
  banco?: string;

  @IsOptional()
  @IsString({ message: 'numeroBoleta debe ser texto' })
  numeroBoleta?: string;

  @IsOptional()
  @IsBoolean({ message: 'usadoParaCierre debe ser booleano' })
  usadoParaCierre?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'proveedorId debe ser un número' })
  proveedorId?: number;

  @IsOptional()
  @IsISO8601({}, { message: 'fecha debe estar en formato ISO 8601' })
  fecha?: string;

  gastoOperativoTipo: GastoOperativoTipo;
}
