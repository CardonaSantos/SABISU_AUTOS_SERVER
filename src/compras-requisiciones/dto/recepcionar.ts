// types/compra-recepcion.request.ts
export interface CompraRecepcionLineaPayload {
  compraDetalleId: number;
  cantidadRecibida: number;
  precioUnitario?: number;
  fechaIngreso?: string; // ISO
  fechaExpiracion?: string | null; // si envías como string desde FE
  ingresadaAStock?: boolean;
}

export interface CompraRecepcionPayload {
  compraId: number;
  usuarioId: number;
  observaciones?: string;
  sucursalId?: number;
  proveedorId?: number;
  lineas: CompraRecepcionLineaPayload[];
}
