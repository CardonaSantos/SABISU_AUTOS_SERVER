import { IsInt, Min, IsOptional, IsNumber } from 'class-validator';

export class SeedYesterdaySnapshotDto {
  @IsInt()
  @Min(1)
  sucursalId!: number;

  @IsOptional()
  @IsNumber()
  saldoFinalCaja?: number; // default 0 si no envías

  @IsOptional()
  @IsNumber()
  saldoFinalBanco?: number; // default 0 si no envías

  @IsOptional()
  @IsInt()
  @Min(1)
  usuarioId?: number; // para dejar trazabilidad en el snapshot global (opcional)
}
