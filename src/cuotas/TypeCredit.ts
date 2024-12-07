export interface Testigo {
  nombre: string;
  telefono: string;
  direccion: string;
}

interface ProductoVenta {
  id: number;
  ventaId: number;
  productoId: number;
  cantidad: number;
  creadoEn: string;
  precioVenta: number;
  producto: {
    id: number;
    nombre: string;
    codigoProducto: string;
  };
}

interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
  dpi: string;
}

interface Sucursal {
  id: number;
  nombre: string;
  direccion: string;
}

interface Usuario {
  id: number;
  nombre: string;
}
interface Cuotas {
  id: number;
  creadoEn: string;
  estado: string;
  fechaPago: string;
  monto: number;
  comentario: string;
  usuario: {
    id: number;
    nombre: string;
  };
}

export interface CreditoRegistro {
  id: number;
  clienteId: number;
  usuarioId: number;
  sucursalId: number;
  totalVenta: number;
  cuotaInicial: number;
  cuotasTotales: number;
  fechaInicio: string;
  estado: string;
  creadoEn: string;
  actualizadoEn: string;
  dpi: string;
  testigos: Testigo[];
  fechaContrato: string;
  montoVenta: number;
  garantiaMeses: number;
  totalPagado: number;
  cliente: Cliente;
  productos: ProductoVenta[];
  sucursal: Sucursal;
  usuario: Usuario;
  cuotas: Cuotas[];
  diasEntrePagos: number;
  interes: number;
  comentario: string;
  montoTotalConInteres: number;
}
