export interface StockAlertItem {
  productoId: number;
  nombre: string;
  precioCosto: number;
  stockActual: number;
  stockMinimo: number;
  /** cantidad que falta para llegar al stock mínimo (>= 1) */
  cantidadSugerida: number;
}

export interface RequisitionLineInput {
  productoId: number;
  /** cantidad final que deseas pedir (>= 1) */
  cantidadSugerida: number;
}

export interface CreateRequisitionDto {
  sucursalId: number;
  usuarioId: number;
  observaciones?: string;
  lineas: RequisitionLineInput[];
}

export interface RequisitionResponse {
  id: number;
  folio: string;
  fecha: string; // ISO
  estado: 'PENDIENTE' | 'APROBADA';
  sucursalId: number;
  usuarioId: number;
  observaciones?: string;
  totalLineas: number;
  lineas: {
    id: number;
    productoId: number;
    cantidadSugerida: number;
    cantidadActual: number;
    stockMinimo: number;
  }[];
}
