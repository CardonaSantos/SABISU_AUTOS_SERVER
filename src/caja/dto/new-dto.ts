export interface VentaLigadaACajaDTO {
  id: number;
  cliente: { id: number; nombre: string } | null;
  totalVenta: number;
  tipoComprobante: string;
  referenciaPago: string | null;
  metodoPago: { metodoPago: string } | null; // ponlo en null si la relación puede ser opcional
  horaVenta: Date; // al serializar va como ISO string
  productos: {
    lineaId: number;
    precioVenta: number;
    estado: string;
    cantidad: number;
    productoId: number;
    nombre: string;
    codigoProducto: string;
  }[];
}
