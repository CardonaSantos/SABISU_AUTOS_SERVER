
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/library.js')


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

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

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




  const path = require('path')

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
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "C:\\Users\\Saint's M\\Desktop\\server-pos\\prisma\\generated\\crm",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [],
    "sourceFilePath": "C:\\Users\\Saint's M\\Desktop\\server-pos\\prisma\\schemaCrm.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../../../.env"
  },
  "relativePath": "../..",
  "clientVersion": "5.20.0",
  "engineVersion": "06fc58a368dc7be9fbbbe894adf8d445d208c284",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_CRM_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "// schemaCrm.prisma (CRM)\ngenerator client {\n  provider = \"prisma-client-js\"\n  output   = \"./generated/crm\" // Define un output específico para el cliente CRM\n}\n\ndatasource db {\n  provider = \"postgresql\"\n  url      = env(\"DATABASE_CRM_URL\")\n}\n\n// schemaCrm.prisma\nmodel Empresa {\n  id               Int                @id @default(autoincrement())\n  nombre           String\n  direccion        String?\n  telefono         String?\n  pbx              String?\n  correo           String?\n  sitioWeb         String?\n  nit              String? // Número de identificación tributaria\n  logo1            String? // URL o path del logo de la empresa\n  logo2            String? // URL o path del logo de la empresa\n  logo3            String? // URL o path del logo de la empresa\n  // saldo           Int?     // Saldo pendiente o registrado de la empresa\n  creadoEn         DateTime           @default(now())\n  actualizadoEn    DateTime           @updatedAt\n  // Relaciones\n  empleados        Usuario[] // Empleados, cobradores, técnicos, etc.\n  rutas            Ruta[] // Rutas asignadas para cobranza\n  clientesInternet ClienteInternet[] // Clientes de servicio de internet\n  facturas         FacturaInternet[] // Facturas generadas para clientes\n  TicketSoporte    TicketSoporte[]\n  saldoEmpresa     SaldoEmpresa?\n  saldoCaja        SaldoCaja?\n  ServicioInternet ServicioInternet[]\n  Ubicacion        Ubicacion[]\n  Proveedor        Proveedor[]\n  Servicio         Servicio[]\n  Factura          Factura[]\n\n  //\n  @@unique([nombre]) // Evita duplicados de empresas\n}\n\nmodel TipoServicio {\n  id          Int            @id @default(autoincrement())\n  nombre      String         @unique // Nombre del tipo de servicio (Ej: \"Internet\", \"IPTV\")\n  descripcion String? // Información adicional sobre el tipo de servicio\n  estado      EstadoServicio @default(ACTIVO) // Activo o inactivo\n\n  creadoEn      DateTime @default(now())\n  actualizadoEn DateTime @updatedAt\n\n  servicios Servicio[]\n}\n\nmodel Servicio {\n  id          Int            @id @default(autoincrement())\n  nombre      String // Ejemplo: \"Plan Básico Q150\", \"IPTV Full\", \"Cámara HD\"\n  descripcion String?\n  precio      Float // Precio del servicio\n  estado      EstadoServicio @default(ACTIVO)\n\n  tipoServicioId Int // Relación con TipoServicio\n  tipoServicio   TipoServicio @relation(fields: [tipoServicioId], references: [id], onDelete: Restrict)\n\n  empresaId Int\n  empresa   Empresa @relation(fields: [empresaId], references: [id], onDelete: Cascade)\n\n  creadoEn      DateTime @default(now())\n  actualizadoEn DateTime @updatedAt\n\n  clientes ClienteServicio[]\n\n  FacturaServicio FacturaServicio[]\n}\n\nmodel Proveedor {\n  id        Int     @id @default(autoincrement())\n  nombre    String\n  correo    String?\n  telefono  String?\n  direccion String?\n  empresaId Int\n  empresa   Empresa @relation(fields: [empresaId], references: [id], onDelete: Cascade)\n}\n\nmodel ServicioInternet {\n  id            Int               @id @default(autoincrement())\n  nombre        String // Ejemplo: \"Plan Básico Q150\", \"Plan Premium Q250\"\n  velocidad     String? // Ejemplo: \"20 Mbps\", \"50 Mbps\"\n  precio        Float // Precio del servicio\n  estado        EstadoServicio    @default(ACTIVO) // Control de disponibilidad del plan\n  creadoEn      DateTime          @default(now())\n  actualizadoEn DateTime          @updatedAt\n  clientes      ClienteInternet[]\n  empresaId     Int\n  empresa       Empresa           @relation(fields: [empresaId], references: [id], onDelete: Cascade)\n}\n\nmodel SaldoEmpresa {\n  id            Int      @id @default(autoincrement())\n  saldo         Float    @default(0)\n  egresos       Float    @default(0)\n  totalIngresos Float\n  empresaId     Int      @unique\n  empresa       Empresa  @relation(references: [id], fields: [empresaId], onDelete: Cascade)\n  creadoEn      DateTime @default(now())\n  actualizadoEn DateTime @updatedAt\n}\n\nmodel SaldoCaja {\n  id            Int   @id @default(autoincrement())\n  saldo         Float @default(0)\n  egreso        Float @default(0)\n  totalIngresos Float\n  totalEgresos  Float\n\n  empresaId Int     @unique\n  empresa   Empresa @relation(references: [id], fields: [empresaId], onDelete: Cascade)\n\n  creadoEn      DateTime       @default(now())\n  actualizadoEn DateTime       @updatedAt\n  registrosCaja RegistroCaja[]\n}\n\nmodel RegistroCaja {\n  id           Int   @id @default(autoincrement())\n  saldoInicial Float\n  saldoFinal   Float\n\n  usuarioId Int? // Clave foránea opcional\n  usuario   Usuario? @relation(fields: [usuarioId], references: [id], onDelete: Cascade) // Relación opcional\n\n  cajaId Int? // Clave foránea opcional\n  caja   SaldoCaja? @relation(fields: [cajaId], references: [id], onDelete: SetNull) // Relación opcional\n\n  creadoEn      DateTime @default(now())\n  actualizadoEn DateTime @updatedAt\n}\n\nmodel ClienteServicio {\n  id Int @id @default(autoincrement())\n\n  clienteId Int\n  cliente   ClienteInternet @relation(fields: [clienteId], references: [id], onDelete: Cascade)\n\n  servicioId Int\n  servicio   Servicio @relation(fields: [servicioId], references: [id], onDelete: Cascade)\n\n  fechaInicio DateTime              @default(now())\n  fechaFin    DateTime?\n  estado      EstadoClienteServicio @default(ACTIVO)\n\n  creadoEn      DateTime @default(now())\n  actualizadoEn DateTime @updatedAt\n}\n\nmodel Factura {\n  id        Int     @id @default(autoincrement())\n  empresaId Int\n  empresa   Empresa @relation(fields: [empresaId], references: [id], onDelete: Cascade)\n\n  clienteId Int\n  cliente   ClienteInternet @relation(fields: [clienteId], references: [id], onDelete: Cascade)\n\n  tipoFactura      TipoFactura // Define si es una factura de Internet u otro servicio\n  montoTotal       Float\n  saldoPendiente   Float         @default(0)\n  fechaEmision     DateTime      @default(now())\n  fechaVencimiento DateTime?\n  estado           EstadoFactura @default(PENDIENTE)\n\n  servicios FacturaServicio[]\n  pagos     PagoFactura[]\n\n  creadoEn      DateTime @default(now())\n  actualizadoEn DateTime @updatedAt\n}\n\nmodel PagoFactura {\n  id Int @id @default(autoincrement())\n\n  facturaId Int\n  factura   Factura @relation(fields: [facturaId], references: [id], onDelete: Cascade)\n\n  clienteId Int\n  cliente   ClienteInternet @relation(fields: [clienteId], references: [id], onDelete: Cascade)\n\n  montoPagado Float\n  metodoPago  MetodoPago\n  fechaPago   DateTime   @default(now())\n\n  creadoEn DateTime @default(now())\n}\n\n// model FacturaInternet {\n//   //factura, o cobro, que se hace de forma mensual, a los clientes por sus servicios, tienen una fecha de pago, esa fecha puede expirar, y deberíamos tomar la fecha pagada, tambien, registrar que usuario le cobró, registró el pago\n//   id  Int @id() @default(autoincrement())\n//   fechaPagoEsperada DateTime? \n//   fechaPagada DateTime? \n//   montoPago Int?\n//   EmpresaId Int\n//   Empresa Empresa @relation(fields: [EmpresaId], references: [id], onDelete: Cascade)\n//   metodoPago MetodoPagoFacturaInternet\n//   clienteId Int\n//   cliente ClienteInternet @relation(references: [id], fields: [clienteId], onDelete: Cascade)\n//   estadoFacturaInternet EstadoFacturaInternet @default(PENDIENTE)\n//   creadoEn     DateTime  @default(now())\n//   actualizadoEn DateTime @updatedAt\n//   PagoFacturaInternet PagoFacturaInternet[]\n// }\n\nmodel FacturaInternet {\n  id                    Int                       @id @default(autoincrement())\n  fechaPagoEsperada     DateTime?\n  fechaPagada           DateTime?\n  montoPago             Float? // Monto total de la factura mensual\n  saldoPendiente        Float?                    @default(0) // Nuevo campo: lo que queda por pagar\n  empresaId             Int\n  empresa               Empresa                   @relation(fields: [empresaId], references: [id], onDelete: Cascade)\n  metodoPago            MetodoPagoFacturaInternet\n  clienteId             Int\n  cliente               ClienteInternet           @relation(fields: [clienteId], references: [id], onDelete: Cascade)\n  estadoFacturaInternet EstadoFacturaInternet     @default(PENDIENTE)\n  pagos                 PagoFacturaInternet[] // Relación 1:N, puede tener múltiples pagos\n  creadoEn              DateTime                  @default(now())\n  actualizadoEn         DateTime                  @updatedAt\n}\n\nmodel PagoFacturaInternet {\n  id                Int                       @id @default(autoincrement())\n  facturaInternetId Int\n  facturaInternet   FacturaInternet           @relation(fields: [facturaInternetId], references: [id], onDelete: Cascade)\n  clienteId         Int\n  cliente           ClienteInternet           @relation(fields: [clienteId], references: [id], onDelete: Cascade)\n  montoPagado       Float\n  metodoPago        MetodoPagoFacturaInternet\n  fechaPago         DateTime                  @default(now())\n  creadoEn          DateTime                  @default(now())\n}\n\nmodel FacturaServicio {\n  id Int @id @default(autoincrement())\n\n  facturaId Int\n  factura   Factura @relation(fields: [facturaId], references: [id], onDelete: Cascade)\n\n  servicioId Int\n  servicio   Servicio @relation(fields: [servicioId], references: [id], onDelete: Cascade)\n\n  cantidad       Int   @default(1)\n  precioUnitario Float\n  total          Float\n\n  creadoEn      DateTime @default(now())\n  actualizadoEn DateTime @updatedAt\n}\n\n// Estudiar esto\nmodel IP {\n  id          Int              @id @default(autoincrement())\n  direccionIp String? // La dirección IP es opcional\n  clienteId   Int?             @unique // Relación uno a uno, asegura que un cliente solo pueda tener una IP\n  cliente     ClienteInternet? @relation(fields: [clienteId], references: [id], onDelete: Cascade) // Relación opcional\n}\n\nmodel Fotos {\n  id         Int     @id @default(autoincrement())\n  nombreFoto String\n  url        String?\n\n  clienteId Int\n  cliente   ClienteInternet @relation(fields: [clienteId], references: [id], onDelete: Cascade)\n\n  creadoEn      DateTime @default(now())\n  actualizadoEn DateTime @updatedAt\n}\n\n// Estudiar esta relacion uno a uno\nmodel ClienteInternet {\n  id            Int     @id() @default(autoincrement())\n  nombre        String\n  telefono      String?\n  direccion     String?\n  dpi           String? // Campo DPI opcional\n  observaciones String?\n\n  //otros datos referncia\n  contactoReferenciaNombre   String?\n  contactoReferenciaTelefono String?\n\n  estadoCliente EstadoCliente\n\n  //DATOS DEL SERVICIO\n  contrasenaWifi   String\n  ssidRouter       String?\n  fechaInstalacion DateTime?\n  asesorId         Int?\n  asesor           Usuario?  @relation(references: [id], fields: [asesorId], onDelete: SetNull)\n\n  servicioId     Int // Relación con ServicioInternet\n  servicio       ServicioInternet @relation(fields: [servicioId], references: [id], onDelete: Restrict)\n  //\n  municipioId    Int?\n  municipio      Municipio?       @relation(fields: [municipioId], references: [id], onDelete: SetNull)\n  departamentoId Int?\n  departamento   Departamento?    @relation(fields: [departamentoId], references: [id], onDelete: SetNull)\n  empresaId      Int\n  empresa        Empresa          @relation(fields: [empresaId], references: [id], onDelete: Cascade)\n  ruta           Ruta[] //rutas a las que puede ser referenciado\n  IP             IP?              @relation() // Relación opcional con IP, un solo cliente puede tener una IP\n  ubicacion      Ubicacion?\n\n  ticketSoporte TicketSoporte[]\n  saldoCliente  saldoCliente?\n\n  creadoEn      DateTime @default(now())\n  actualizadoEn DateTime @updatedAt\n  //fotos y referencias del cliente\n  fotos         Fotos[]\n\n  //OTROS SERVICIOS COMO IPTV, CAMÁRAS, SASS, ETC.\n  clienteServicio     ClienteServicio[]\n  //facturas que generamos mes a mes internet\n  facturaInternet     FacturaInternet[]\n  PagoFacturaInternet PagoFacturaInternet[]\n  // Facturas y pagos del cliente\n  factura             Factura[]\n  pagoFactura         PagoFactura[]\n}\n\nmodel saldoCliente {\n  id             Int    @id @default(autoincrement())\n  saldoPendiente Float?\n  saldoFavor     Float?\n  totalPagos     Float?\n\n  clienteId     Int             @unique\n  cliente       ClienteInternet @relation(fields: [clienteId], references: [id], onDelete: Cascade)\n  creadoEn      DateTime        @default(now())\n  actualizadoEn DateTime        @updatedAt\n}\n\nmodel Ubicacion {\n  id        Int             @id @default(autoincrement())\n  creadoEn  DateTime        @default(now())\n  latitud   Float?\n  longitud  Float?\n  clienteId Int             @unique // Necesitas especificar UNIQUE para que sea uno a uno\n  cliente   ClienteInternet @relation(references: [id], fields: [clienteId], onDelete: Cascade)\n  empresaId Int\n  empresa   Empresa         @relation(fields: [empresaId], references: [id], onDelete: Cascade)\n}\n\nmodel Departamento {\n  id         Int               @id @default(autoincrement())\n  nombre     String            @unique\n  municipios Municipio[] // Relación con municipios\n  clientes   ClienteInternet[] // Relación con los clientes\n}\n\nmodel Municipio {\n  id             Int               @id @default(autoincrement())\n  nombre         String            @unique\n  departamentoId Int\n  departamento   Departamento      @relation(fields: [departamentoId], references: [id], onDelete: Cascade)\n  clientes       ClienteInternet[] // Relación con los clientes\n}\n\nmodel Ruta {\n  id           Int               @id @default(autoincrement())\n  nombreRuta   String\n  cobradorId   Int\n  cobrador     Usuario           @relation(fields: [cobradorId], references: [id], onDelete: Cascade) // Lo relacionamos con quien va a cobrar\n  cobrados     Int // Número de clientes cobrados en la ruta\n  montoCobrado Int // Monto total cobrado en la ruta\n  Clientes     ClienteInternet[] // Relación con clientes asignados a la ruta\n  estadoRuta   EstadoRuta\n  EmpresaId    Int\n  Empresa      Empresa           @relation(fields: [EmpresaId], references: [id], onDelete: Cascade)\n}\n\nmodel TicketSoporte {\n  id        Int             @id @default(autoincrement())\n  clienteId Int // Cliente que solicita el soporte | cliente asignado\n  cliente   ClienteInternet @relation(fields: [clienteId], references: [id], onDelete: Cascade)\n\n  empresaId Int\n  empresa   Empresa @relation(fields: [empresaId], references: [id], onDelete: Cascade)\n\n  tecnicoId Int? // Técnico asignado\n  tecnico   Usuario? @relation(\"TicketTecnico\", fields: [tecnicoId], references: [id], onDelete: SetNull)\n\n  creadoPorId Int? // Usuario que creó el ticket\n  creadoPor   Usuario? @relation(\"TicketCreador\", fields: [creadoPorId], references: [id], onDelete: SetNull)\n\n  estado        EstadoTicketSoporte    @default(ABIERTA)\n  prioridad     PrioridadTicketSoporte @default(MEDIA)\n  descripcion   String\n  comentarios   String?\n  fechaCreacion DateTime               @default(now())\n  fechaCierre   DateTime?\n\n  SeguimientoTicket SeguimientoTicket[]\n}\n\nmodel SeguimientoTicket {\n  id       Int           @id @default(autoincrement())\n  ticketId Int\n  ticket   TicketSoporte @relation(fields: [ticketId], references: [id], onDelete: Cascade)\n\n  usuarioId Int // Usuario que realizó el soporte (técnico)\n  usuario   Usuario @relation(fields: [usuarioId], references: [id], onDelete: Cascade)\n\n  descripcion   String // Acción realizada (o más bien comentarios que iremos dejando como en el crm)\n  fechaRegistro DateTime @default(now())\n  // estadoNuevo     EstadoTicketSoporte\n}\n\nmodel Usuario {\n  id                Int                 @id @default(autoincrement())\n  empresaId         Int // Relación con la empresa\n  empresa           Empresa             @relation(fields: [empresaId], references: [id], onDelete: Cascade)\n  sucursalId        Int? // Relación opcional con una sucursal\n  nombre            String\n  correo            String              @unique\n  telefono          String?\n  rol               RolUsuario // Enum para roles (ADMIN, COBRADOR, TECNICO, etc.)\n  activo            Boolean             @default(true)\n  creadoEn          DateTime            @default(now())\n  actualizadoEn     DateTime            @updatedAt\n  Ruta              Ruta[]\n  // Relación con tickets donde el usuario es el técnico asignado\n  ticketsAsignados  TicketSoporte[]     @relation(\"TicketTecnico\")\n  // Relación con tickets donde el usuario creó el ticket\n  ticketsCreados    TicketSoporte[]     @relation(\"TicketCreador\")\n  //usuarios que pueden comentar los tickets\n  SeguimientoTicket SeguimientoTicket[]\n\n  //referencia a los clientes que le dimos asesoramiento, o bien que fueron creados por nosotros\n  clientesAsesorados ClienteInternet[]\n\n  //Registros de caja chica\n  RegistroCaja RegistroCaja[]\n}\n\nenum EstadoRuta {\n  ACTIVO\n  CERRADO\n  CANCELADO\n}\n\nenum EstadoCliente {\n  ACTIVO\n  MOROSO\n  SUSPENDIDO\n  DESINSTALADO\n}\n\nenum EstadoServicio {\n  ACTIVO\n  INACTIVO\n}\n\nenum EstadoFacturaInternet {\n  PENDIENTE\n  PAGADA\n  ATRASADA\n  CANCELADA\n}\n\nenum EstadoTicketSoporte {\n  ABIERTA\n  EN_PROCESO\n  PENDIENTE_CLIENTE\n  PENDIENTE_TECNICO\n  RESUELTA\n  CANCELADA\n}\n\nenum TipoFactura {\n  INTERNET\n  SERVICIO_ADICIONAL\n}\n\nenum PrioridadTicketSoporte {\n  BAJA\n  MEDIA\n  ALTA\n  CRITICA\n}\n\nenum RolUsuario {\n  TECNICO\n  OFICINA\n  ADMIN\n  SUPER_ADMIN\n}\n\nenum EstadoClienteServicio {\n  ACTIVO\n  SUSPENDIDO\n  CANCELADO\n}\n\nenum MetodoPago {\n  EFECTIVO\n  TARJETA\n  TRANSFERENCIA\n  PAYPAL\n}\n\nenum EstadoFactura {\n  PENDIENTE\n  PAGADA\n  ATRASADA\n  CANCELADA\n}\n\nenum MetodoPagoFacturaInternet {\n  EFECTIVO\n  TARJETA\n  TRANSFERENCIA\n  PAYPAL\n}\n",
  "inlineSchemaHash": "2684ab9540e6aea31ad4ffbb8e5d085c9c9cc1cd1b91b8e3eb7cc5cc924c1bb2",
  "copyEngine": true
}

const fs = require('fs')

config.dirname = __dirname
if (!fs.existsSync(path.join(__dirname, 'schema.prisma'))) {
  const alternativePaths = [
    "prisma/generated/crm",
    "generated/crm",
  ]
  
  const alternativePath = alternativePaths.find((altPath) => {
    return fs.existsSync(path.join(process.cwd(), altPath, 'schema.prisma'))
  }) ?? alternativePaths[0]

  config.dirname = path.join(process.cwd(), alternativePath)
  config.isBundled = true
}

config.runtimeDataModel = JSON.parse("{\"models\":{\"Empresa\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nombre\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"direccion\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"telefono\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pbx\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"correo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sitioWeb\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nit\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"logo1\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"logo2\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"logo3\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actualizadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"empleados\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Usuario\",\"relationName\":\"EmpresaToUsuario\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rutas\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Ruta\",\"relationName\":\"EmpresaToRuta\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientesInternet\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ClienteInternet\",\"relationName\":\"ClienteInternetToEmpresa\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"facturas\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FacturaInternet\",\"relationName\":\"EmpresaToFacturaInternet\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"TicketSoporte\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TicketSoporte\",\"relationName\":\"EmpresaToTicketSoporte\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"saldoEmpresa\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SaldoEmpresa\",\"relationName\":\"EmpresaToSaldoEmpresa\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"saldoCaja\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SaldoCaja\",\"relationName\":\"EmpresaToSaldoCaja\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ServicioInternet\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ServicioInternet\",\"relationName\":\"EmpresaToServicioInternet\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"Ubicacion\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Ubicacion\",\"relationName\":\"EmpresaToUbicacion\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"Proveedor\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Proveedor\",\"relationName\":\"EmpresaToProveedor\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"Servicio\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Servicio\",\"relationName\":\"EmpresaToServicio\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"Factura\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Factura\",\"relationName\":\"EmpresaToFactura\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"nombre\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"nombre\"]}],\"isGenerated\":false},\"TipoServicio\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nombre\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"descripcion\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estado\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"EstadoServicio\",\"default\":\"ACTIVO\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actualizadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"servicios\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Servicio\",\"relationName\":\"ServicioToTipoServicio\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Servicio\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nombre\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"descripcion\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"precio\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estado\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"EstadoServicio\",\"default\":\"ACTIVO\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tipoServicioId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tipoServicio\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TipoServicio\",\"relationName\":\"ServicioToTipoServicio\",\"relationFromFields\":[\"tipoServicioId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Restrict\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"empresaId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"empresa\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Empresa\",\"relationName\":\"EmpresaToServicio\",\"relationFromFields\":[\"empresaId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actualizadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"clientes\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ClienteServicio\",\"relationName\":\"ClienteServicioToServicio\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"FacturaServicio\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FacturaServicio\",\"relationName\":\"FacturaServicioToServicio\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Proveedor\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nombre\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"correo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"telefono\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"direccion\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"empresaId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"empresa\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Empresa\",\"relationName\":\"EmpresaToProveedor\",\"relationFromFields\":[\"empresaId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ServicioInternet\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nombre\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"velocidad\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"precio\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estado\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"EstadoServicio\",\"default\":\"ACTIVO\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actualizadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"clientes\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ClienteInternet\",\"relationName\":\"ClienteInternetToServicioInternet\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"empresaId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"empresa\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Empresa\",\"relationName\":\"EmpresaToServicioInternet\",\"relationFromFields\":[\"empresaId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SaldoEmpresa\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"saldo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Float\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"egresos\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Float\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalIngresos\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"empresaId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"empresa\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Empresa\",\"relationName\":\"EmpresaToSaldoEmpresa\",\"relationFromFields\":[\"empresaId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actualizadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SaldoCaja\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"saldo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Float\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"egreso\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Float\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalIngresos\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalEgresos\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"empresaId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"empresa\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Empresa\",\"relationName\":\"EmpresaToSaldoCaja\",\"relationFromFields\":[\"empresaId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actualizadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"registrosCaja\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RegistroCaja\",\"relationName\":\"RegistroCajaToSaldoCaja\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"RegistroCaja\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"saldoInicial\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"saldoFinal\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"usuarioId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"usuario\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Usuario\",\"relationName\":\"RegistroCajaToUsuario\",\"relationFromFields\":[\"usuarioId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cajaId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"caja\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SaldoCaja\",\"relationName\":\"RegistroCajaToSaldoCaja\",\"relationFromFields\":[\"cajaId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actualizadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ClienteServicio\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clienteId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cliente\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ClienteInternet\",\"relationName\":\"ClienteInternetToClienteServicio\",\"relationFromFields\":[\"clienteId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"servicioId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"servicio\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Servicio\",\"relationName\":\"ClienteServicioToServicio\",\"relationFromFields\":[\"servicioId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fechaInicio\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fechaFin\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estado\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"EstadoClienteServicio\",\"default\":\"ACTIVO\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actualizadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Factura\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"empresaId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"empresa\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Empresa\",\"relationName\":\"EmpresaToFactura\",\"relationFromFields\":[\"empresaId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clienteId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cliente\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ClienteInternet\",\"relationName\":\"ClienteInternetToFactura\",\"relationFromFields\":[\"clienteId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tipoFactura\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TipoFactura\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"montoTotal\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"saldoPendiente\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Float\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fechaEmision\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fechaVencimiento\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estado\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"EstadoFactura\",\"default\":\"PENDIENTE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"servicios\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FacturaServicio\",\"relationName\":\"FacturaToFacturaServicio\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pagos\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PagoFactura\",\"relationName\":\"FacturaToPagoFactura\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actualizadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"PagoFactura\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"facturaId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"factura\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Factura\",\"relationName\":\"FacturaToPagoFactura\",\"relationFromFields\":[\"facturaId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clienteId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cliente\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ClienteInternet\",\"relationName\":\"ClienteInternetToPagoFactura\",\"relationFromFields\":[\"clienteId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"montoPagado\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metodoPago\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"MetodoPago\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fechaPago\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"FacturaInternet\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fechaPagoEsperada\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fechaPagada\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"montoPago\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"saldoPendiente\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Float\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"empresaId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"empresa\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Empresa\",\"relationName\":\"EmpresaToFacturaInternet\",\"relationFromFields\":[\"empresaId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metodoPago\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"MetodoPagoFacturaInternet\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clienteId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cliente\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ClienteInternet\",\"relationName\":\"ClienteInternetToFacturaInternet\",\"relationFromFields\":[\"clienteId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estadoFacturaInternet\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"EstadoFacturaInternet\",\"default\":\"PENDIENTE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pagos\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PagoFacturaInternet\",\"relationName\":\"FacturaInternetToPagoFacturaInternet\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actualizadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"PagoFacturaInternet\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"facturaInternetId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"facturaInternet\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FacturaInternet\",\"relationName\":\"FacturaInternetToPagoFacturaInternet\",\"relationFromFields\":[\"facturaInternetId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clienteId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cliente\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ClienteInternet\",\"relationName\":\"ClienteInternetToPagoFacturaInternet\",\"relationFromFields\":[\"clienteId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"montoPagado\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metodoPago\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"MetodoPagoFacturaInternet\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fechaPago\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"FacturaServicio\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"facturaId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"factura\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Factura\",\"relationName\":\"FacturaToFacturaServicio\",\"relationFromFields\":[\"facturaId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"servicioId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"servicio\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Servicio\",\"relationName\":\"FacturaServicioToServicio\",\"relationFromFields\":[\"servicioId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cantidad\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":1,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"precioUnitario\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"total\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actualizadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"IP\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"direccionIp\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clienteId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cliente\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ClienteInternet\",\"relationName\":\"ClienteInternetToIP\",\"relationFromFields\":[\"clienteId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Fotos\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nombreFoto\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"url\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clienteId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cliente\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ClienteInternet\",\"relationName\":\"ClienteInternetToFotos\",\"relationFromFields\":[\"clienteId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actualizadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ClienteInternet\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nombre\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"telefono\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"direccion\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dpi\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"observaciones\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contactoReferenciaNombre\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contactoReferenciaTelefono\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estadoCliente\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"EstadoCliente\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contrasenaWifi\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ssidRouter\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fechaInstalacion\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"asesorId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"asesor\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Usuario\",\"relationName\":\"ClienteInternetToUsuario\",\"relationFromFields\":[\"asesorId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"servicioId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"servicio\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ServicioInternet\",\"relationName\":\"ClienteInternetToServicioInternet\",\"relationFromFields\":[\"servicioId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Restrict\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"municipioId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"municipio\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Municipio\",\"relationName\":\"ClienteInternetToMunicipio\",\"relationFromFields\":[\"municipioId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"departamentoId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"departamento\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Departamento\",\"relationName\":\"ClienteInternetToDepartamento\",\"relationFromFields\":[\"departamentoId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"empresaId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"empresa\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Empresa\",\"relationName\":\"ClienteInternetToEmpresa\",\"relationFromFields\":[\"empresaId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ruta\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Ruta\",\"relationName\":\"ClienteInternetToRuta\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"IP\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"IP\",\"relationName\":\"ClienteInternetToIP\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ubicacion\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Ubicacion\",\"relationName\":\"ClienteInternetToUbicacion\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ticketSoporte\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TicketSoporte\",\"relationName\":\"ClienteInternetToTicketSoporte\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"saldoCliente\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"saldoCliente\",\"relationName\":\"ClienteInternetTosaldoCliente\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actualizadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"fotos\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Fotos\",\"relationName\":\"ClienteInternetToFotos\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clienteServicio\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ClienteServicio\",\"relationName\":\"ClienteInternetToClienteServicio\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"facturaInternet\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"FacturaInternet\",\"relationName\":\"ClienteInternetToFacturaInternet\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"PagoFacturaInternet\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PagoFacturaInternet\",\"relationName\":\"ClienteInternetToPagoFacturaInternet\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"factura\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Factura\",\"relationName\":\"ClienteInternetToFactura\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"pagoFactura\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PagoFactura\",\"relationName\":\"ClienteInternetToPagoFactura\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"saldoCliente\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"saldoPendiente\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"saldoFavor\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalPagos\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clienteId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cliente\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ClienteInternet\",\"relationName\":\"ClienteInternetTosaldoCliente\",\"relationFromFields\":[\"clienteId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actualizadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Ubicacion\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"latitud\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"longitud\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Float\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clienteId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cliente\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ClienteInternet\",\"relationName\":\"ClienteInternetToUbicacion\",\"relationFromFields\":[\"clienteId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"empresaId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"empresa\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Empresa\",\"relationName\":\"EmpresaToUbicacion\",\"relationFromFields\":[\"empresaId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Departamento\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nombre\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"municipios\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Municipio\",\"relationName\":\"DepartamentoToMunicipio\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientes\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ClienteInternet\",\"relationName\":\"ClienteInternetToDepartamento\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Municipio\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nombre\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"departamentoId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"departamento\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Departamento\",\"relationName\":\"DepartamentoToMunicipio\",\"relationFromFields\":[\"departamentoId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientes\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ClienteInternet\",\"relationName\":\"ClienteInternetToMunicipio\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Ruta\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nombreRuta\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cobradorId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cobrador\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Usuario\",\"relationName\":\"RutaToUsuario\",\"relationFromFields\":[\"cobradorId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cobrados\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"montoCobrado\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"Clientes\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ClienteInternet\",\"relationName\":\"ClienteInternetToRuta\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estadoRuta\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"EstadoRuta\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"EmpresaId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"Empresa\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Empresa\",\"relationName\":\"EmpresaToRuta\",\"relationFromFields\":[\"EmpresaId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"TicketSoporte\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clienteId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cliente\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ClienteInternet\",\"relationName\":\"ClienteInternetToTicketSoporte\",\"relationFromFields\":[\"clienteId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"empresaId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"empresa\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Empresa\",\"relationName\":\"EmpresaToTicketSoporte\",\"relationFromFields\":[\"empresaId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tecnicoId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tecnico\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Usuario\",\"relationName\":\"TicketTecnico\",\"relationFromFields\":[\"tecnicoId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creadoPorId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creadoPor\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Usuario\",\"relationName\":\"TicketCreador\",\"relationFromFields\":[\"creadoPorId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"estado\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"EstadoTicketSoporte\",\"default\":\"ABIERTA\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"prioridad\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"PrioridadTicketSoporte\",\"default\":\"MEDIA\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"descripcion\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"comentarios\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fechaCreacion\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fechaCierre\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"SeguimientoTicket\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SeguimientoTicket\",\"relationName\":\"SeguimientoTicketToTicketSoporte\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"SeguimientoTicket\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ticketId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ticket\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TicketSoporte\",\"relationName\":\"SeguimientoTicketToTicketSoporte\",\"relationFromFields\":[\"ticketId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"usuarioId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"usuario\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Usuario\",\"relationName\":\"SeguimientoTicketToUsuario\",\"relationFromFields\":[\"usuarioId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"descripcion\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"fechaRegistro\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Usuario\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":{\"name\":\"autoincrement\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"empresaId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"empresa\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Empresa\",\"relationName\":\"EmpresaToUsuario\",\"relationFromFields\":[\"empresaId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sucursalId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nombre\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"correo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"telefono\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"rol\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RolUsuario\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"activo\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":true,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"creadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actualizadoEn\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"Ruta\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Ruta\",\"relationName\":\"RutaToUsuario\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ticketsAsignados\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TicketSoporte\",\"relationName\":\"TicketTecnico\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ticketsCreados\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"TicketSoporte\",\"relationName\":\"TicketCreador\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"SeguimientoTicket\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"SeguimientoTicket\",\"relationName\":\"SeguimientoTicketToUsuario\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientesAsesorados\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ClienteInternet\",\"relationName\":\"ClienteInternetToUsuario\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"RegistroCaja\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RegistroCaja\",\"relationName\":\"RegistroCajaToUsuario\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"EstadoRuta\":{\"values\":[{\"name\":\"ACTIVO\",\"dbName\":null},{\"name\":\"CERRADO\",\"dbName\":null},{\"name\":\"CANCELADO\",\"dbName\":null}],\"dbName\":null},\"EstadoCliente\":{\"values\":[{\"name\":\"ACTIVO\",\"dbName\":null},{\"name\":\"MOROSO\",\"dbName\":null},{\"name\":\"SUSPENDIDO\",\"dbName\":null},{\"name\":\"DESINSTALADO\",\"dbName\":null}],\"dbName\":null},\"EstadoServicio\":{\"values\":[{\"name\":\"ACTIVO\",\"dbName\":null},{\"name\":\"INACTIVO\",\"dbName\":null}],\"dbName\":null},\"EstadoFacturaInternet\":{\"values\":[{\"name\":\"PENDIENTE\",\"dbName\":null},{\"name\":\"PAGADA\",\"dbName\":null},{\"name\":\"ATRASADA\",\"dbName\":null},{\"name\":\"CANCELADA\",\"dbName\":null}],\"dbName\":null},\"EstadoTicketSoporte\":{\"values\":[{\"name\":\"ABIERTA\",\"dbName\":null},{\"name\":\"EN_PROCESO\",\"dbName\":null},{\"name\":\"PENDIENTE_CLIENTE\",\"dbName\":null},{\"name\":\"PENDIENTE_TECNICO\",\"dbName\":null},{\"name\":\"RESUELTA\",\"dbName\":null},{\"name\":\"CANCELADA\",\"dbName\":null}],\"dbName\":null},\"TipoFactura\":{\"values\":[{\"name\":\"INTERNET\",\"dbName\":null},{\"name\":\"SERVICIO_ADICIONAL\",\"dbName\":null}],\"dbName\":null},\"PrioridadTicketSoporte\":{\"values\":[{\"name\":\"BAJA\",\"dbName\":null},{\"name\":\"MEDIA\",\"dbName\":null},{\"name\":\"ALTA\",\"dbName\":null},{\"name\":\"CRITICA\",\"dbName\":null}],\"dbName\":null},\"RolUsuario\":{\"values\":[{\"name\":\"TECNICO\",\"dbName\":null},{\"name\":\"OFICINA\",\"dbName\":null},{\"name\":\"ADMIN\",\"dbName\":null},{\"name\":\"SUPER_ADMIN\",\"dbName\":null}],\"dbName\":null},\"EstadoClienteServicio\":{\"values\":[{\"name\":\"ACTIVO\",\"dbName\":null},{\"name\":\"SUSPENDIDO\",\"dbName\":null},{\"name\":\"CANCELADO\",\"dbName\":null}],\"dbName\":null},\"MetodoPago\":{\"values\":[{\"name\":\"EFECTIVO\",\"dbName\":null},{\"name\":\"TARJETA\",\"dbName\":null},{\"name\":\"TRANSFERENCIA\",\"dbName\":null},{\"name\":\"PAYPAL\",\"dbName\":null}],\"dbName\":null},\"EstadoFactura\":{\"values\":[{\"name\":\"PENDIENTE\",\"dbName\":null},{\"name\":\"PAGADA\",\"dbName\":null},{\"name\":\"ATRASADA\",\"dbName\":null},{\"name\":\"CANCELADA\",\"dbName\":null}],\"dbName\":null},\"MetodoPagoFacturaInternet\":{\"values\":[{\"name\":\"EFECTIVO\",\"dbName\":null},{\"name\":\"TARJETA\",\"dbName\":null},{\"name\":\"TRANSFERENCIA\",\"dbName\":null},{\"name\":\"PAYPAL\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined


const { warnEnvConflicts } = require('./runtime/library.js')

warnEnvConflicts({
    rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.rootEnvPath),
    schemaEnvPath: config.relativeEnvPaths.schemaEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.schemaEnvPath)
})

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

// file annotations for bundling tools to include these files
path.join(__dirname, "query_engine-windows.dll.node");
path.join(process.cwd(), "prisma/generated/crm/query_engine-windows.dll.node")
// file annotations for bundling tools to include these files
path.join(__dirname, "schema.prisma");
path.join(process.cwd(), "prisma/generated/crm/schema.prisma")
