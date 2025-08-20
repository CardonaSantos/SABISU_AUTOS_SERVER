export interface ResumenDiarioSucursal {
  fecha: string;
  sucursal: { id: number; nombre: string };
  saldoInicio: number;
  totales: {
    ventasEfectivo: number;
    otrosIngresos: number;
    gastosOperativos: number;
    costoVenta: number;
    depositosProveedor: number;
    depositosCierre: number;
    otrosEgresos: number;
  };
  ingresos: number; // caja = ventasEfectivo + otrosIngresos
  egresos: number; // caja = costos + gastos + depósitos + otros
  saldoFinal: number;
  registros: number; // cierres/arqueos del día
  breakdown: BreakdownMovimientos;
}
export interface ResumenDiarioResponse {
  fecha: string; // ISO de inicio del día
  items: ResumenDiarioSucursal[];
}

export type Agg = { monto: number; cantidad: number };

export type BreakdownMovimientos = {
  // Sumatoria por TIPO (INGRESO, EGRESO, DEPOSITO_BANCO, ...)
  porTipo: Partial<
    Record<
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
      | 'OTRO',
      Agg
    >
  >;

  // Sumatoria por CATEGORIA (GASTO_OPERATIVO, COSTO_VENTA, ...)
  porCategoria: Partial<
    Record<
      | 'GASTO_OPERATIVO'
      | 'COSTO_VENTA'
      | 'DEPOSITO_PROVEEDOR'
      | 'DEPOSITO_CIERRE',
      Agg
    >
  >;

  // Desglose de "otros ingresos" por tipo que hoy sumas juntos
  ingresosPorTipo: Partial<Record<'INGRESO' | 'ABONO' | 'TRANSFERENCIA', Agg>>;

  // (opcional) ventas en efectivo del día (llega de tu helper de turnos)
  ventasEfectivo: number;

  // (opcional) top de movimientos para drilldown instantáneo
  top: Array<{
    id: number;
    fecha: string;
    tipo: string;
    categoria: string | null;
    monto: number;
    descripcion: string | null;
    proveedor?: { id: number; nombre: string } | null;
  }>;
};
