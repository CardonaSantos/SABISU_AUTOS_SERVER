import { IsInt, IsOptional, IsString, IsEnum } from 'class-validator';
import { TipoAjuste } from 'prisma/generated/pos';

export class CreateAjusteStockDto {
  @IsInt()
  productoId: number;

  @IsInt()
  @IsOptional()
  stockId?: number; // Opcional, se usa solo si es un ajuste específico sobre un stock

  @IsInt()
  cantidadAjustada: number; // La cantidad que se ajusta, puede ser positiva o negativa

  @IsEnum(TipoAjuste)
  tipoAjuste: TipoAjuste; // Enum de tipo de ajuste: INCREMENTO, DECREMENTO o CORRECCION

  @IsInt()
  @IsOptional()
  usuarioId?: number; // Opcional, puede ser nulo si no hay un usuario asociado al ajuste

  @IsString()
  @IsOptional()
  descripcion?: string; // Descripción opcional para el motivo del ajuste
}
