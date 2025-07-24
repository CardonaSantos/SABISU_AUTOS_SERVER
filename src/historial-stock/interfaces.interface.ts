import { TipoMovimientoStock } from '@prisma/client';

export interface UsuarioDTO {
  id: number;
  nombre: string;
  rol: string;
  correo: string;
}

export interface SucursalDTO {
  id: number;
  nombre: string;
  direccion: string;
}

export interface ImagenProductoDTO {
  id: number;
  url: string;
  // …otros campos si los tienes…
}

export interface ProductoDTO {
  id: number;
  nombre: string;
  codigoProducto: string;
  codigoProveedor: string;
  categorias: any[]; // Ajusta a CategoriaDTO[] si tienes esa interfaz
  descripcion: string | null;
  imagenesProducto: ImagenProductoDTO[];
}

export interface RequisicionDTO {
  id: number;
  createdAt: string;
  updatedAt: string;
  estado: string;
  folio: string;
  fecha: string;
  fechaRecepcion: string;
  ingresadaAStock: boolean;
  sucursal: { id: number; nombre: string };
  observaciones: string | null;
  usuario: { id: number; nombre: string; rol: string };
}

export interface VentaDetalleDTO {
  id: number;
  metodoPago: string;
  cliente: { id: number; nombre: string; telefono: string };
  fechaVenta: string;
  sucursal: SucursalDTO;
}

export interface VentaStockDTO {
  id: number;
  cantidad: number;
  creadoEn: string;
  precioVenta: number;
  producto: { id: number; nombre: string; codigoProducto: string };
  venta: VentaDetalleDTO;
}

export interface AjusteStockDTO {
  id: number;
  cantidadAjustada: number;
  descripcion: string | null;
  fechaHora: string;
  tipoAjuste: string;
  usuario: UsuarioDTO;
  stock: {
    id: number;
    fechaIngreso: string;
    fechaVencimiento: string | null;
    cantidadInicial: number | null;
    creadoEn: string;
    actualizadoEn: string;
  };
}

export interface EliminacionStockDTO {
  id: number;
  createdAt: string;
  producto: {
    id: number;
    nombre: string;
    codigoProducto: string;
    codigoProveedor: string;
    descripcion: string | null;
  };
  usuario: UsuarioDTO;
  sucursal: SucursalDTO;
  cantidadAnterior: number;
  motivo: string;
  stockRestante: number;
  cantidadStockEliminada: number;
}

export interface EliminacionVentaDTO {
  id: number;
  cliente: { id: number; nombre: string };
  fechaEliminacion: string;
  sucursal: SucursalDTO;
  motivo: string;
  usuario: UsuarioDTO;
}

export interface TransferenciaProductoDTO {
  id: number;
  cantidad: number;
  fechaTransferencia: string;
  producto: {
    id: number;
    nombre: string;
    codigoProducto: string;
    codigoProveedor: string;
    descripcion: string | null;
  };
  sucursalDestino: SucursalDTO;
  sucursalOrigen: SucursalDTO;
  usuarioEncargado: UsuarioDTO;
}

export interface EntregaStockDTO {
  id: number;
  fechaEntrega: string;
  montoTotal: number;
  sucursal: SucursalDTO;
  proveedor: { id: number; nombre: string };
  usuarioRecibido: UsuarioDTO;
}

export interface HistorialStockDTO {
  id: number;
  comentario: string | null;
  tipo: TipoMovimientoStock;
  fechaCambio: string; // ISO string
  cantidadAnterior: number | null;
  cantidadNueva: number | null;
  usuario: UsuarioDTO;
  sucursal: SucursalDTO;
  producto: ProductoDTO | null;
  requisicion?: RequisicionDTO;
  venta?: VentaStockDTO;
  ajusteStock?: AjusteStockDTO;
  eliminacionStock?: EliminacionStockDTO;
  eliminacionVenta?: EliminacionVentaDTO;
  transferenciaProducto?: TransferenciaProductoDTO;
  entregaStock?: EntregaStockDTO;
}
