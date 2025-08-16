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
}
export interface ResumenDiarioResponse {
  fecha: string; // ISO de inicio del día
  items: ResumenDiarioSucursal[];
}
