// dtos/capital-inicial.dto.ts
import { IsBoolean, IsDateString, IsInt, IsOptional } from 'class-validator';

export class CapitalInicialQueryDto {
  @IsInt()
  sucursalId!: number;

  @IsOptional()
  @IsDateString()
  fecha?: string; // ISO (día de apertura)

  @IsOptional()
  @IsBoolean()
  ajustarDepositosCierre?: boolean; // default true
}

export type CapitalInicialResponse = {
  sucursalId: number;
  fecha: string; // ISO day
  saldoInicialSugerido: number;
  criterio:
    | 'ARRASTRE_SALDO_FINAL'
    | 'FONDO_FIJO_POR_DEPOSITO'
    | 'SIN_CIERRE_PREVIO';
  contexto: {
    ultimoCierreId: number | null;
    ultimoCierreFecha: string | null;
    saldoFinalAnterior: number | null;
    fondoFijoAnterior: number | null;
    depositoCierreDetectado: boolean;
  };
};
