// /cuentas-bancarias/dto/cuenta-bancaria-response.dto.ts
export class CuentaBancariaResponseDto {
  id: number;
  banco: string;
  numero: string;
  alias: string | null;
  tipo: string;
  activa: boolean;
  creadoEn: Date;
  actualizadoEn: Date;

  movimientosCount: number;
  saldoActual: number; // calculado
  ultimoMovimiento?: Date; // fecha último mov
}
