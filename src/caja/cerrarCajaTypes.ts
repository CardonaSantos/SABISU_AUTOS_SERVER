// dto/cerrar-caja-v2.dto.ts
export type ModoCierre =
  | 'SIN_DEPOSITO'
  | 'DEPOSITO_PARCIAL'
  | 'DEPOSITO_TODO'
  | 'CAMBIO_TURNO'; // sin depósito, sólo cerrar y abrir el siguiente

export class CerrarCajaV2Dto {
  registroCajaId!: number;
  usuarioCierreId!: number;
  comentarioFinal?: string;

  modo!: ModoCierre;

  // solo si hay depósito:
  cuentaBancariaId?: number;
  montoParcial?: number; // requerido si DEPOSITO_PARCIAL

  // sólo si CAMBIO_TURNO:
  abrirSiguiente?: boolean; // default true
  usuarioInicioSiguienteId?: number; // si no viene, usar usuarioCierreId
  fondoFijoSiguiente?: number; // si no viene, usar el del turno cerrando
  comentarioAperturaSiguiente?: string;
}
