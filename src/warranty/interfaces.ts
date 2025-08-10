import { EstadoGarantia } from '@prisma/client';

export interface RegistroGarantiaDto {
  id: number;
  estado: EstadoGarantia;
  fechaRegistro: string;
  accionesRealizadas?: string;
  conclusion?: string;
  usuario?: { id: number; nombre: string };
}

export interface MovimientoStockDto {
  id: number;
  cantidadAnterior: number;
  cantidadNueva: number;
  fechaCambio: string;
  usuario: { id: number; nombre: string };
}

export interface GarantiaDto {
  id: number;
  ventaId: number;
  venta: { id: number; fechaVenta: string };
  fechaRecepcion: string;
  estado: EstadoGarantia;
  cantidadDevuelta: number;
  cliente: { id: number; nombre: string };
  producto: {
    id: number;
    nombre: string;
    codigo: string;
    descripcion: string | null;
  };
  proveedor?: { id: number; nombre: string };
  usuarioRecibe?: { id: number; nombre: string };
  registros: RegistroGarantiaDto[];
  // movimientoStock: MovimientoStockDto[];
}
