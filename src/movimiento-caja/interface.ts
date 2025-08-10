export type TipoMovimiento =
  | 'INGRESO'
  | 'EGRESO'
  | 'VENTA'
  | 'ABONO'
  | 'RETIRO'
  | 'DEPOSITO_BANCO'
  | 'CHEQUE'
  | 'TRANSFERENCIA'
  | 'AJUSTE'
  | 'DEVOLUCION'
  | 'OTRO';

export type CategoriaMovimiento =
  | 'COSTO_VENTA'
  | 'DEPOSITO_CIERRE'
  | 'DEPOSITO_PROVEEDOR'
  | 'GASTO_OPERATIVO';

export interface MovimientoCajaItem {
  id: number;
  fecha: string; // ISO
  tipo: TipoMovimiento;
  categoria: CategoriaMovimiento;
  monto: number;
  descripcion: string | null;
  referencia: string | null;
  banco: string | null;
  numeroBoleta: string | null;
  usadoParaCierre: boolean;
  proveedor: { id: number; nombre: string } | null;
  usuario: { id: number; nombre: string };
}
