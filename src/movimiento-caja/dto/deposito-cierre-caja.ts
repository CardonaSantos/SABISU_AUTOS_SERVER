export class DepositoCierreDto {
  sucursalId: number;
  usuarioId: number;
  banco: string;
  numeroBoleta: string;
  monto?: number; // requerido SOLO si depositarTodo = false
  depositarTodo?: boolean; // default true si quieres
  descripcion?: string;
  fecha?: string;
}
