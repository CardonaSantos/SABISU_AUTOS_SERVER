
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

exports.Prisma.EmpresaScalarFieldEnum = {
  id: 'id',
  nombre: 'nombre',
  direccion: 'direccion',
  telefono: 'telefono',
  pbx: 'pbx',
  correo: 'correo',
  sitioWeb: 'sitioWeb',
  nit: 'nit',
  logo1: 'logo1',
  logo2: 'logo2',
  logo3: 'logo3',
  creadoEn: 'creadoEn',
  actualizadoEn: 'actualizadoEn'
};

exports.Prisma.TipoServicioScalarFieldEnum = {
  id: 'id',
  nombre: 'nombre',
  descripcion: 'descripcion',
  estado: 'estado',
  creadoEn: 'creadoEn',
  actualizadoEn: 'actualizadoEn'
};

exports.Prisma.ServicioScalarFieldEnum = {
  id: 'id',
  nombre: 'nombre',
  descripcion: 'descripcion',
  precio: 'precio',
  estado: 'estado',
  tipoServicioId: 'tipoServicioId',
  empresaId: 'empresaId',
  creadoEn: 'creadoEn',
  actualizadoEn: 'actualizadoEn'
};

exports.Prisma.ProveedorScalarFieldEnum = {
  id: 'id',
  nombre: 'nombre',
  correo: 'correo',
  telefono: 'telefono',
  direccion: 'direccion',
  empresaId: 'empresaId'
};

exports.Prisma.ServicioInternetScalarFieldEnum = {
  id: 'id',
  nombre: 'nombre',
  velocidad: 'velocidad',
  precio: 'precio',
  estado: 'estado',
  creadoEn: 'creadoEn',
  actualizadoEn: 'actualizadoEn',
  empresaId: 'empresaId'
};

exports.Prisma.SaldoEmpresaScalarFieldEnum = {
  id: 'id',
  saldo: 'saldo',
  egresos: 'egresos',
  totalIngresos: 'totalIngresos',
  empresaId: 'empresaId',
  creadoEn: 'creadoEn',
  actualizadoEn: 'actualizadoEn'
};

exports.Prisma.SaldoCajaScalarFieldEnum = {
  id: 'id',
  saldo: 'saldo',
  egreso: 'egreso',
  totalIngresos: 'totalIngresos',
  totalEgresos: 'totalEgresos',
  empresaId: 'empresaId',
  creadoEn: 'creadoEn',
  actualizadoEn: 'actualizadoEn'
};

exports.Prisma.RegistroCajaScalarFieldEnum = {
  id: 'id',
  saldoInicial: 'saldoInicial',
  saldoFinal: 'saldoFinal',
  usuarioId: 'usuarioId',
  cajaId: 'cajaId',
  creadoEn: 'creadoEn',
  actualizadoEn: 'actualizadoEn'
};

exports.Prisma.ClienteServicioScalarFieldEnum = {
  id: 'id',
  clienteId: 'clienteId',
  servicioId: 'servicioId',
  fechaInicio: 'fechaInicio',
  fechaFin: 'fechaFin',
  estado: 'estado',
  creadoEn: 'creadoEn',
  actualizadoEn: 'actualizadoEn'
};

exports.Prisma.FacturaScalarFieldEnum = {
  id: 'id',
  empresaId: 'empresaId',
  clienteId: 'clienteId',
  tipoFactura: 'tipoFactura',
  montoTotal: 'montoTotal',
  saldoPendiente: 'saldoPendiente',
  fechaEmision: 'fechaEmision',
  fechaVencimiento: 'fechaVencimiento',
  estado: 'estado',
  creadoEn: 'creadoEn',
  actualizadoEn: 'actualizadoEn'
};

exports.Prisma.PagoFacturaScalarFieldEnum = {
  id: 'id',
  facturaId: 'facturaId',
  clienteId: 'clienteId',
  montoPagado: 'montoPagado',
  metodoPago: 'metodoPago',
  fechaPago: 'fechaPago',
  creadoEn: 'creadoEn'
};

exports.Prisma.FacturaInternetScalarFieldEnum = {
  id: 'id',
  fechaPagoEsperada: 'fechaPagoEsperada',
  fechaPagada: 'fechaPagada',
  montoPago: 'montoPago',
  saldoPendiente: 'saldoPendiente',
  empresaId: 'empresaId',
  metodoPago: 'metodoPago',
  clienteId: 'clienteId',
  estadoFacturaInternet: 'estadoFacturaInternet',
  creadoEn: 'creadoEn',
  actualizadoEn: 'actualizadoEn'
};

exports.Prisma.PagoFacturaInternetScalarFieldEnum = {
  id: 'id',
  facturaInternetId: 'facturaInternetId',
  clienteId: 'clienteId',
  montoPagado: 'montoPagado',
  metodoPago: 'metodoPago',
  fechaPago: 'fechaPago',
  creadoEn: 'creadoEn'
};

exports.Prisma.FacturaServicioScalarFieldEnum = {
  id: 'id',
  facturaId: 'facturaId',
  servicioId: 'servicioId',
  cantidad: 'cantidad',
  precioUnitario: 'precioUnitario',
  total: 'total',
  creadoEn: 'creadoEn',
  actualizadoEn: 'actualizadoEn'
};

exports.Prisma.IPScalarFieldEnum = {
  id: 'id',
  direccionIp: 'direccionIp',
  clienteId: 'clienteId'
};

exports.Prisma.FotosScalarFieldEnum = {
  id: 'id',
  nombreFoto: 'nombreFoto',
  url: 'url',
  clienteId: 'clienteId',
  creadoEn: 'creadoEn',
  actualizadoEn: 'actualizadoEn'
};

exports.Prisma.ClienteInternetScalarFieldEnum = {
  id: 'id',
  nombre: 'nombre',
  telefono: 'telefono',
  direccion: 'direccion',
  dpi: 'dpi',
  observaciones: 'observaciones',
  contactoReferenciaNombre: 'contactoReferenciaNombre',
  contactoReferenciaTelefono: 'contactoReferenciaTelefono',
  estadoCliente: 'estadoCliente',
  contrasenaWifi: 'contrasenaWifi',
  ssidRouter: 'ssidRouter',
  fechaInstalacion: 'fechaInstalacion',
  asesorId: 'asesorId',
  servicioId: 'servicioId',
  municipioId: 'municipioId',
  departamentoId: 'departamentoId',
  empresaId: 'empresaId',
  creadoEn: 'creadoEn',
  actualizadoEn: 'actualizadoEn'
};

exports.Prisma.SaldoClienteScalarFieldEnum = {
  id: 'id',
  saldoPendiente: 'saldoPendiente',
  saldoFavor: 'saldoFavor',
  totalPagos: 'totalPagos',
  clienteId: 'clienteId',
  creadoEn: 'creadoEn',
  actualizadoEn: 'actualizadoEn'
};

exports.Prisma.UbicacionScalarFieldEnum = {
  id: 'id',
  creadoEn: 'creadoEn',
  latitud: 'latitud',
  longitud: 'longitud',
  clienteId: 'clienteId',
  empresaId: 'empresaId'
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

exports.Prisma.RutaScalarFieldEnum = {
  id: 'id',
  nombreRuta: 'nombreRuta',
  cobradorId: 'cobradorId',
  cobrados: 'cobrados',
  montoCobrado: 'montoCobrado',
  estadoRuta: 'estadoRuta',
  EmpresaId: 'EmpresaId'
};

exports.Prisma.TicketSoporteScalarFieldEnum = {
  id: 'id',
  clienteId: 'clienteId',
  empresaId: 'empresaId',
  tecnicoId: 'tecnicoId',
  creadoPorId: 'creadoPorId',
  estado: 'estado',
  prioridad: 'prioridad',
  descripcion: 'descripcion',
  comentarios: 'comentarios',
  fechaCreacion: 'fechaCreacion',
  fechaCierre: 'fechaCierre'
};

exports.Prisma.SeguimientoTicketScalarFieldEnum = {
  id: 'id',
  ticketId: 'ticketId',
  usuarioId: 'usuarioId',
  descripcion: 'descripcion',
  fechaRegistro: 'fechaRegistro'
};

exports.Prisma.UsuarioScalarFieldEnum = {
  id: 'id',
  empresaId: 'empresaId',
  sucursalId: 'sucursalId',
  nombre: 'nombre',
  correo: 'correo',
  telefono: 'telefono',
  rol: 'rol',
  activo: 'activo',
  creadoEn: 'creadoEn',
  actualizadoEn: 'actualizadoEn'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.EstadoServicio = exports.$Enums.EstadoServicio = {
  ACTIVO: 'ACTIVO',
  INACTIVO: 'INACTIVO'
};

exports.EstadoClienteServicio = exports.$Enums.EstadoClienteServicio = {
  ACTIVO: 'ACTIVO',
  SUSPENDIDO: 'SUSPENDIDO',
  CANCELADO: 'CANCELADO'
};

exports.TipoFactura = exports.$Enums.TipoFactura = {
  INTERNET: 'INTERNET',
  SERVICIO_ADICIONAL: 'SERVICIO_ADICIONAL'
};

exports.EstadoFactura = exports.$Enums.EstadoFactura = {
  PENDIENTE: 'PENDIENTE',
  PAGADA: 'PAGADA',
  ATRASADA: 'ATRASADA',
  CANCELADA: 'CANCELADA'
};

exports.MetodoPago = exports.$Enums.MetodoPago = {
  EFECTIVO: 'EFECTIVO',
  TARJETA: 'TARJETA',
  TRANSFERENCIA: 'TRANSFERENCIA',
  PAYPAL: 'PAYPAL'
};

exports.MetodoPagoFacturaInternet = exports.$Enums.MetodoPagoFacturaInternet = {
  EFECTIVO: 'EFECTIVO',
  TARJETA: 'TARJETA',
  TRANSFERENCIA: 'TRANSFERENCIA',
  PAYPAL: 'PAYPAL'
};

exports.EstadoFacturaInternet = exports.$Enums.EstadoFacturaInternet = {
  PENDIENTE: 'PENDIENTE',
  PAGADA: 'PAGADA',
  ATRASADA: 'ATRASADA',
  CANCELADA: 'CANCELADA'
};

exports.EstadoCliente = exports.$Enums.EstadoCliente = {
  ACTIVO: 'ACTIVO',
  MOROSO: 'MOROSO',
  SUSPENDIDO: 'SUSPENDIDO',
  DESINSTALADO: 'DESINSTALADO'
};

exports.EstadoRuta = exports.$Enums.EstadoRuta = {
  ACTIVO: 'ACTIVO',
  CERRADO: 'CERRADO',
  CANCELADO: 'CANCELADO'
};

exports.EstadoTicketSoporte = exports.$Enums.EstadoTicketSoporte = {
  ABIERTA: 'ABIERTA',
  EN_PROCESO: 'EN_PROCESO',
  PENDIENTE_CLIENTE: 'PENDIENTE_CLIENTE',
  PENDIENTE_TECNICO: 'PENDIENTE_TECNICO',
  RESUELTA: 'RESUELTA',
  CANCELADA: 'CANCELADA'
};

exports.PrioridadTicketSoporte = exports.$Enums.PrioridadTicketSoporte = {
  BAJA: 'BAJA',
  MEDIA: 'MEDIA',
  ALTA: 'ALTA',
  CRITICA: 'CRITICA'
};

exports.RolUsuario = exports.$Enums.RolUsuario = {
  TECNICO: 'TECNICO',
  OFICINA: 'OFICINA',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN'
};

exports.Prisma.ModelName = {
  Empresa: 'Empresa',
  TipoServicio: 'TipoServicio',
  Servicio: 'Servicio',
  Proveedor: 'Proveedor',
  ServicioInternet: 'ServicioInternet',
  SaldoEmpresa: 'SaldoEmpresa',
  SaldoCaja: 'SaldoCaja',
  RegistroCaja: 'RegistroCaja',
  ClienteServicio: 'ClienteServicio',
  Factura: 'Factura',
  PagoFactura: 'PagoFactura',
  FacturaInternet: 'FacturaInternet',
  PagoFacturaInternet: 'PagoFacturaInternet',
  FacturaServicio: 'FacturaServicio',
  IP: 'IP',
  Fotos: 'Fotos',
  ClienteInternet: 'ClienteInternet',
  saldoCliente: 'saldoCliente',
  Ubicacion: 'Ubicacion',
  Departamento: 'Departamento',
  Municipio: 'Municipio',
  Ruta: 'Ruta',
  TicketSoporte: 'TicketSoporte',
  SeguimientoTicket: 'SeguimientoTicket',
  Usuario: 'Usuario'
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
