
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.20.0
 * Query Engine version: 06fc58a368dc7be9fbbbe894adf8d445d208c284
 */
Prisma.prismaVersion = {
  client: "5.20.0",
  engine: "06fc58a368dc7be9fbbbe894adf8d445d208c284"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.ReparacionScalarFieldEnum = {
  id: 'id',
  usuarioId: 'usuarioId',
  sucursalId: 'sucursalId',
  clienteId: 'clienteId',
  productoId: 'productoId',
  productoExterno: 'productoExterno',
  problemas: 'problemas',
  observaciones: 'observaciones',
  fechaRecibido: 'fechaRecibido',
  fechaEntregado: 'fechaEntregado',
  estado: 'estado',
  hojaSolucion: 'hojaSolucion',
  creadoEn: 'creadoEn',
  actualizadoEn: 'actualizadoEn'
};

exports.Prisma.RegistroReparacionScalarFieldEnum = {
  id: 'id',
  reparacionId: 'reparacionId',
  usuarioId: 'usuarioId',
  estado: 'estado',
  accionesRealizadas: 'accionesRealizadas',
  fechaRegistro: 'fechaRegistro',
  comentarioFinal: 'comentarioFinal',
  montoPagado: 'montoPagado'
};

exports.Prisma.VentaCuotaScalarFieldEnum = {
  id: 'id',
  clienteId: 'clienteId',
  usuarioId: 'usuarioId',
  sucursalId: 'sucursalId',
  totalVenta: 'totalVenta',
  cuotaInicial: 'cuotaInicial',
  cuotasTotales: 'cuotasTotales',
  fechaInicio: 'fechaInicio',
  estado: 'estado',
  creadoEn: 'creadoEn',
  actualizadoEn: 'actualizadoEn',
  dpi: 'dpi',
  testigos: 'testigos',
  fechaContrato: 'fechaContrato',
  montoVenta: 'montoVenta',
  garantiaMeses: 'garantiaMeses',
  totalPagado: 'totalPagado',
  diasEntrePagos: 'diasEntrePagos',
  interes: 'interes',
  comentario: 'comentario',
  ventaId: 'ventaId',
  montoTotalConInteres: 'montoTotalConInteres'
};

exports.Prisma.CuotaScalarFieldEnum = {
  id: 'id',
  ventaCuotaId: 'ventaCuotaId',
  monto: 'monto',
  fechaVencimiento: 'fechaVencimiento',
  fechaPago: 'fechaPago',
  estado: 'estado',
  usuarioId: 'usuarioId',
  creadoEn: 'creadoEn',
  actualizadoEn: 'actualizadoEn',
  comentario: 'comentario',
  montoEsperado: 'montoEsperado'
};

exports.Prisma.PlantillaComprobanteScalarFieldEnum = {
  id: 'id',
  nombre: 'nombre',
  texto: 'texto',
  sucursalId: 'sucursalId',
  creadoEn: 'creadoEn',
  actualizadoEn: 'actualizadoEn'
};

exports.Prisma.VentaEliminadaScalarFieldEnum = {
  id: 'id',
  usuarioId: 'usuarioId',
  motivo: 'motivo',
  totalVenta: 'totalVenta',
  clienteId: 'clienteId',
  fechaEliminacion: 'fechaEliminacion',
  sucursalId: 'sucursalId'
};

exports.Prisma.VentaEliminadaProductoScalarFieldEnum = {
  id: 'id',
  ventaEliminadaId: 'ventaEliminadaId',
  productoId: 'productoId',
  cantidad: 'cantidad',
  precioVenta: 'precioVenta',
  creadoEn: 'creadoEn'
};

exports.Prisma.SucursalSaldoScalarFieldEnum = {
  id: 'id',
  sucursalId: 'sucursalId',
  saldoAcumulado: 'saldoAcumulado',
  totalIngresos: 'totalIngresos',
  totalEgresos: 'totalEgresos',
  actualizadoEn: 'actualizadoEn'
};

exports.Prisma.RegistroCajaScalarFieldEnum = {
  id: 'id',
  sucursalId: 'sucursalId',
  usuarioId: 'usuarioId',
  saldoInicial: 'saldoInicial',
  saldoFinal: 'saldoFinal',
  fechaInicio: 'fechaInicio',
  fechaCierre: 'fechaCierre',
  estado: 'estado',
  comentario: 'comentario'
};

exports.Prisma.SucursalSaldoGlobalScalarFieldEnum = {
  id: 'id',
  saldoGlobal: 'saldoGlobal',
  totalIngresos: 'totalIngresos',
  totalEgresos: 'totalEgresos',
  actualizadoEn: 'actualizadoEn'
};

exports.Prisma.DepositoScalarFieldEnum = {
  id: 'id',
  registroCajaId: 'registroCajaId',
  monto: 'monto',
  numeroBoleta: 'numeroBoleta',
  banco: 'banco',
  fechaDeposito: 'fechaDeposito',
  usadoParaCierre: 'usadoParaCierre',
  descripcion: 'descripcion',
  sucursalId: 'sucursalId',
  usuarioId: 'usuarioId'
};

exports.Prisma.EgresoScalarFieldEnum = {
  id: 'id',
  registroCajaId: 'registroCajaId',
  descripcion: 'descripcion',
  monto: 'monto',
  fechaEgreso: 'fechaEgreso',
  sucursalId: 'sucursalId',
  usuarioId: 'usuarioId'
};

exports.Prisma.TicketSorteoScalarFieldEnum = {
  id: 'id',
  descripcionSorteo: 'descripcionSorteo',
  creadoEn: 'creadoEn',
  actualizadoEn: 'actualizadoEn',
  estado: 'estado'
};

exports.Prisma.VencimientoScalarFieldEnum = {
  id: 'id',
  fechaVencimiento: 'fechaVencimiento',
  estado: 'estado',
  descripcion: 'descripcion',
  stockId: 'stockId',
  fechaCreacion: 'fechaCreacion'
};

exports.Prisma.NotificacionScalarFieldEnum = {
  id: 'id',
  mensaje: 'mensaje',
  remitenteId: 'remitenteId',
  tipoNotificacion: 'tipoNotificacion',
  referenciaId: 'referenciaId',
  fechaCreacion: 'fechaCreacion'
};

exports.Prisma.NotificacionesUsuariosScalarFieldEnum = {
  id: 'id',
  usuarioId: 'usuarioId',
  notificacionId: 'notificacionId',
  leido: 'leido',
  eliminado: 'eliminado',
  leidoEn: 'leidoEn',
  recibidoEn: 'recibidoEn'
};

exports.Prisma.SolicitudPrecioScalarFieldEnum = {
  id: 'id',
  productoId: 'productoId',
  precioSolicitado: 'precioSolicitado',
  solicitadoPorId: 'solicitadoPorId',
  estado: 'estado',
  aprobadoPorId: 'aprobadoPorId',
  fechaSolicitud: 'fechaSolicitud',
  fechaRespuesta: 'fechaRespuesta'
};

exports.Prisma.ProductoScalarFieldEnum = {
  id: 'id',
  nombre: 'nombre',
  descripcion: 'descripcion',
  codigoProducto: 'codigoProducto',
  creadoEn: 'creadoEn',
  actualizadoEn: 'actualizadoEn',
  precioCostoActual: 'precioCostoActual'
};

exports.Prisma.HistorialPrecioCostoScalarFieldEnum = {
  id: 'id',
  productoId: 'productoId',
  precioCostoAnterior: 'precioCostoAnterior',
  precioCostoNuevo: 'precioCostoNuevo',
  fechaCambio: 'fechaCambio',
  modificadoPorId: 'modificadoPorId'
};

exports.Prisma.PrecioProductoScalarFieldEnum = {
  id: 'id',
  productoId: 'productoId',
  precio: 'precio',
  creadoPorId: 'creadoPorId',
  fechaCreacion: 'fechaCreacion',
  estado: 'estado',
  usado: 'usado',
  tipo: 'tipo'
};

exports.Prisma.HistorialPrecioScalarFieldEnum = {
  id: 'id',
  productoId: 'productoId',
  precioAnterior: 'precioAnterior',
  precioNuevo: 'precioNuevo',
  fechaCambio: 'fechaCambio'
};

exports.Prisma.AjusteStockScalarFieldEnum = {
  id: 'id',
  productoId: 'productoId',
  stockId: 'stockId',
  cantidadAjustada: 'cantidadAjustada',
  tipoAjuste: 'tipoAjuste',
  fechaHora: 'fechaHora',
  usuarioId: 'usuarioId',
  descripcion: 'descripcion'
};

exports.Prisma.EliminacionStockScalarFieldEnum = {
  id: 'id',
  productoId: 'productoId',
  fechaHora: 'fechaHora',
  usuarioId: 'usuarioId',
  sucursalId: 'sucursalId',
  motivo: 'motivo'
};

exports.Prisma.EliminacionProductoScalarFieldEnum = {
  id: 'id',
  productoId: 'productoId',
  fechaHora: 'fechaHora',
  usuarioId: 'usuarioId',
  motivo: 'motivo'
};

exports.Prisma.EliminacionClienteScalarFieldEnum = {
  id: 'id',
  clienteId: 'clienteId',
  fechaHora: 'fechaHora',
  usuarioId: 'usuarioId',
  motivo: 'motivo'
};

exports.Prisma.StockScalarFieldEnum = {
  id: 'id',
  productoId: 'productoId',
  cantidad: 'cantidad',
  costoTotal: 'costoTotal',
  creadoEn: 'creadoEn',
  fechaIngreso: 'fechaIngreso',
  fechaVencimiento: 'fechaVencimiento',
  precioCosto: 'precioCosto',
  entregaStockId: 'entregaStockId',
  sucursalId: 'sucursalId'
};

exports.Prisma.SucursalScalarFieldEnum = {
  id: 'id',
  nombre: 'nombre',
  direccion: 'direccion',
  telefono: 'telefono',
  pbx: 'pbx',
  creadoEn: 'creadoEn',
  actualizadoEn: 'actualizadoEn',
  tipoSucursal: 'tipoSucursal',
  estadoOperacion: 'estadoOperacion'
};

exports.Prisma.EntregaStockScalarFieldEnum = {
  id: 'id',
  proveedorId: 'proveedorId',
  montoTotal: 'montoTotal',
  fechaEntrega: 'fechaEntrega',
  recibidoPorId: 'recibidoPorId',
  sucursalId: 'sucursalId'
};

exports.Prisma.UsuarioScalarFieldEnum = {
  id: 'id',
  nombre: 'nombre',
  rol: 'rol',
  contrasena: 'contrasena',
  activo: 'activo',
  correo: 'correo',
  sucursalId: 'sucursalId',
  fecha_creacion: 'fecha_creacion',
  fecha_actualizacion: 'fecha_actualizacion'
};

exports.Prisma.MetaUsuarioScalarFieldEnum = {
  id: 'id',
  usuarioId: 'usuarioId',
  sucursalId: 'sucursalId',
  fechaInicio: 'fechaInicio',
  fechaFin: 'fechaFin',
  montoMeta: 'montoMeta',
  montoActual: 'montoActual',
  cumplida: 'cumplida',
  fechaCumplida: 'fechaCumplida',
  numeroVentas: 'numeroVentas',
  tituloMeta: 'tituloMeta',
  estado: 'estado'
};

exports.Prisma.MetaCobrosScalarFieldEnum = {
  id: 'id',
  usuarioId: 'usuarioId',
  sucursalId: 'sucursalId',
  fechaCreado: 'fechaCreado',
  fechaInicio: 'fechaInicio',
  fechaFin: 'fechaFin',
  montoMeta: 'montoMeta',
  montoActual: 'montoActual',
  cumplida: 'cumplida',
  fechaCumplida: 'fechaCumplida',
  numeroDepositos: 'numeroDepositos',
  tituloMeta: 'tituloMeta',
  estado: 'estado'
};

exports.Prisma.DepositoCobroScalarFieldEnum = {
  id: 'id',
  usuarioId: 'usuarioId',
  sucursalId: 'sucursalId',
  numeroBoleta: 'numeroBoleta',
  fechaRegistro: 'fechaRegistro',
  montoDepositado: 'montoDepositado',
  descripcion: 'descripcion',
  metaCobroId: 'metaCobroId'
};

exports.Prisma.ClienteScalarFieldEnum = {
  id: 'id',
  nombre: 'nombre',
  telefono: 'telefono',
  direccion: 'direccion',
  creadoEn: 'creadoEn',
  actualizadoEn: 'actualizadoEn',
  municipioId: 'municipioId',
  departamentoId: 'departamentoId',
  dpi: 'dpi',
  iPInternet: 'iPInternet'
};

exports.Prisma.GarantiaScalarFieldEnum = {
  id: 'id',
  clienteId: 'clienteId',
  productoId: 'productoId',
  usuarioIdRecibe: 'usuarioIdRecibe',
  comentario: 'comentario',
  descripcionProblema: 'descripcionProblema',
  fechaRecepcion: 'fechaRecepcion',
  estado: 'estado',
  creadoEn: 'creadoEn',
  actualizadoEn: 'actualizadoEn',
  proveedorId: 'proveedorId'
};

exports.Prisma.RegistroGarantiaScalarFieldEnum = {
  id: 'id',
  garantiaId: 'garantiaId',
  usuarioId: 'usuarioId',
  productoId: 'productoId',
  estado: 'estado',
  conclusion: 'conclusion',
  accionesRealizadas: 'accionesRealizadas',
  fechaRegistro: 'fechaRegistro',
  proveedorId: 'proveedorId'
};

exports.Prisma.PagoScalarFieldEnum = {
  id: 'id',
  ventaId: 'ventaId',
  monto: 'monto',
  metodoPago: 'metodoPago',
  fechaPago: 'fechaPago'
};

exports.Prisma.HistorialStockScalarFieldEnum = {
  id: 'id',
  productoId: 'productoId',
  cantidadAnterior: 'cantidadAnterior',
  cantidadNueva: 'cantidadNueva',
  fechaCambio: 'fechaCambio'
};

exports.Prisma.VentaScalarFieldEnum = {
  id: 'id',
  clienteId: 'clienteId',
  fechaVenta: 'fechaVenta',
  horaVenta: 'horaVenta',
  totalVenta: 'totalVenta',
  sucursalId: 'sucursalId',
  nombreClienteFinal: 'nombreClienteFinal',
  telefonoClienteFinal: 'telefonoClienteFinal',
  direccionClienteFinal: 'direccionClienteFinal',
  imei: 'imei',
  registroCajaId: 'registroCajaId'
};

exports.Prisma.TransferenciaProductoScalarFieldEnum = {
  id: 'id',
  productoId: 'productoId',
  cantidad: 'cantidad',
  sucursalOrigenId: 'sucursalOrigenId',
  sucursalDestinoId: 'sucursalDestinoId',
  fechaTransferencia: 'fechaTransferencia',
  usuarioEncargadoId: 'usuarioEncargadoId'
};

exports.Prisma.SolicitudTransferenciaProductoScalarFieldEnum = {
  id: 'id',
  productoId: 'productoId',
  cantidad: 'cantidad',
  sucursalOrigenId: 'sucursalOrigenId',
  sucursalDestinoId: 'sucursalDestinoId',
  usuarioSolicitanteId: 'usuarioSolicitanteId',
  estado: 'estado',
  fechaSolicitud: 'fechaSolicitud',
  fechaAprobacion: 'fechaAprobacion',
  administradorId: 'administradorId'
};

exports.Prisma.VentaProductoScalarFieldEnum = {
  id: 'id',
  ventaId: 'ventaId',
  productoId: 'productoId',
  cantidad: 'cantidad',
  creadoEn: 'creadoEn',
  precioVenta: 'precioVenta'
};

exports.Prisma.ProveedorScalarFieldEnum = {
  id: 'id',
  nombre: 'nombre',
  correo: 'correo',
  telefono: 'telefono',
  direccion: 'direccion',
  razonSocial: 'razonSocial',
  rfc: 'rfc',
  nombreContacto: 'nombreContacto',
  telefonoContacto: 'telefonoContacto',
  emailContacto: 'emailContacto',
  pais: 'pais',
  ciudad: 'ciudad',
  codigoPostal: 'codigoPostal',
  latitud: 'latitud',
  longitud: 'longitud',
  activo: 'activo',
  notas: 'notas',
  creadoEn: 'creadoEn',
  actualizadoEn: 'actualizadoEn'
};

exports.Prisma.CategoriaScalarFieldEnum = {
  id: 'id',
  nombre: 'nombre'
};

exports.Prisma.DepartamentoScalarFieldEnum = {
  id: 'id',
  nombre: 'nombre'
};

exports.Prisma.MunicipioScalarFieldEnum = {
  id: 'id',
  nombre: 'nombre',
  departamentoId: 'departamentoId'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.EstadoReparacion = exports.$Enums.EstadoReparacion = {
  RECIBIDO: 'RECIBIDO',
  PENDIENTE: 'PENDIENTE',
  EN_PROCESO: 'EN_PROCESO',
  ESPERANDO_PIEZAS: 'ESPERANDO_PIEZAS',
  REPARADO: 'REPARADO',
  ENTREGADO: 'ENTREGADO',
  CANCELADO: 'CANCELADO',
  NO_REPARABLE: 'NO_REPARABLE',
  FINALIZADO: 'FINALIZADO'
};

exports.EstadoCuota = exports.$Enums.EstadoCuota = {
  ACTIVA: 'ACTIVA',
  COMPLETADA: 'COMPLETADA',
  CANCELADA: 'CANCELADA'
};

exports.EstadoPago = exports.$Enums.EstadoPago = {
  PENDIENTE: 'PENDIENTE',
  PAGADA: 'PAGADA',
  ATRASADA: 'ATRASADA'
};

exports.EstadoCaja = exports.$Enums.EstadoCaja = {
  ABIERTO: 'ABIERTO',
  CERRADO: 'CERRADO'
};

exports.EstadoTicket = exports.$Enums.EstadoTicket = {
  ACTIVO: 'ACTIVO',
  INACTIVO: 'INACTIVO'
};

exports.EstadoVencimiento = exports.$Enums.EstadoVencimiento = {
  PENDIENTE: 'PENDIENTE',
  NOTIFICADO: 'NOTIFICADO',
  RESUELTO: 'RESUELTO'
};

exports.TipoNotificacion = exports.$Enums.TipoNotificacion = {
  SOLICITUD_PRECIO: 'SOLICITUD_PRECIO',
  TRANSFERENCIA: 'TRANSFERENCIA',
  VENCIMIENTO: 'VENCIMIENTO',
  OTRO: 'OTRO'
};

exports.EstadoSolicitud = exports.$Enums.EstadoSolicitud = {
  PENDIENTE: 'PENDIENTE',
  APROBADO: 'APROBADO',
  RECHAZADO: 'RECHAZADO'
};

exports.EstadoPrecio = exports.$Enums.EstadoPrecio = {
  APROBADO: 'APROBADO',
  PENDIENTE: 'PENDIENTE',
  RECHAZADO: 'RECHAZADO'
};

exports.TipoPrecio = exports.$Enums.TipoPrecio = {
  CREADO_POR_SOLICITUD: 'CREADO_POR_SOLICITUD',
  ESTANDAR: 'ESTANDAR'
};

exports.TipoAjuste = exports.$Enums.TipoAjuste = {
  INCREMENTO: 'INCREMENTO',
  DECREMENTO: 'DECREMENTO',
  CORRECCION: 'CORRECCION'
};

exports.TipoSucursal = exports.$Enums.TipoSucursal = {
  TIENDA: 'TIENDA',
  ALMACEN: 'ALMACEN',
  CENTRO_DISTRIBUCION: 'CENTRO_DISTRIBUCION',
  TALLER: 'TALLER',
  OFICINA: 'OFICINA'
};

exports.Rol = exports.$Enums.Rol = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  VENDEDOR: 'VENDEDOR',
  SUPER_ADMIN: 'SUPER_ADMIN'
};

exports.EstadoMetaTienda = exports.$Enums.EstadoMetaTienda = {
  CANCELADO: 'CANCELADO',
  ABIERTO: 'ABIERTO',
  FINALIZADO: 'FINALIZADO',
  CERRADO: 'CERRADO'
};

exports.EstadoMetaCobro = exports.$Enums.EstadoMetaCobro = {
  CANCELADO: 'CANCELADO',
  ABIERTO: 'ABIERTO',
  FINALIZADO: 'FINALIZADO',
  CERRADO: 'CERRADO'
};

exports.EstadoGarantia = exports.$Enums.EstadoGarantia = {
  RECIBIDO: 'RECIBIDO',
  ENVIADO_A_PROVEEDOR: 'ENVIADO_A_PROVEEDOR',
  EN_REPARACION: 'EN_REPARACION',
  REPARADO: 'REPARADO',
  REEMPLAZADO: 'REEMPLAZADO',
  ENTREGADO_CLIENTE: 'ENTREGADO_CLIENTE',
  CERRADO: 'CERRADO'
};

exports.MetodoPago = exports.$Enums.MetodoPago = {
  CONTADO: 'CONTADO',
  TARJETA: 'TARJETA',
  TRANSFERENCIA: 'TRANSFERENCIA',
  PAYPAL: 'PAYPAL',
  OTRO: 'OTRO',
  CUTOAS: 'CUTOAS',
  CREDITO: 'CREDITO'
};

exports.EstadoSolicitudTransferencia = exports.$Enums.EstadoSolicitudTransferencia = {
  PENDIENTE: 'PENDIENTE',
  APROBADO: 'APROBADO',
  RECHAZADO: 'RECHAZADO'
};

exports.Prisma.ModelName = {
  Reparacion: 'Reparacion',
  RegistroReparacion: 'RegistroReparacion',
  VentaCuota: 'VentaCuota',
  Cuota: 'Cuota',
  PlantillaComprobante: 'PlantillaComprobante',
  VentaEliminada: 'VentaEliminada',
  VentaEliminadaProducto: 'VentaEliminadaProducto',
  SucursalSaldo: 'SucursalSaldo',
  RegistroCaja: 'RegistroCaja',
  SucursalSaldoGlobal: 'SucursalSaldoGlobal',
  Deposito: 'Deposito',
  Egreso: 'Egreso',
  TicketSorteo: 'TicketSorteo',
  Vencimiento: 'Vencimiento',
  Notificacion: 'Notificacion',
  NotificacionesUsuarios: 'NotificacionesUsuarios',
  SolicitudPrecio: 'SolicitudPrecio',
  Producto: 'Producto',
  HistorialPrecioCosto: 'HistorialPrecioCosto',
  PrecioProducto: 'PrecioProducto',
  HistorialPrecio: 'HistorialPrecio',
  AjusteStock: 'AjusteStock',
  EliminacionStock: 'EliminacionStock',
  EliminacionProducto: 'EliminacionProducto',
  EliminacionCliente: 'EliminacionCliente',
  Stock: 'Stock',
  Sucursal: 'Sucursal',
  EntregaStock: 'EntregaStock',
  Usuario: 'Usuario',
  MetaUsuario: 'MetaUsuario',
  MetaCobros: 'MetaCobros',
  DepositoCobro: 'DepositoCobro',
  Cliente: 'Cliente',
  Garantia: 'Garantia',
  RegistroGarantia: 'RegistroGarantia',
  Pago: 'Pago',
  HistorialStock: 'HistorialStock',
  Venta: 'Venta',
  TransferenciaProducto: 'TransferenciaProducto',
  SolicitudTransferenciaProducto: 'SolicitudTransferenciaProducto',
  VentaProducto: 'VentaProducto',
  Proveedor: 'Proveedor',
  Categoria: 'Categoria',
  Departamento: 'Departamento',
  Municipio: 'Municipio'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
