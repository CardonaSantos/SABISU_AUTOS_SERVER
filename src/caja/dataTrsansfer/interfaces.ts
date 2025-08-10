import { EstadoTurnoCaja } from '@prisma/client';

export interface CajaAbierta {
  id: number;
  saldoInicial: number;
  comentario?: string;
  comentarioFinal?: string;
  fechaApertura: Date;
  sucursalId: number;
  sucursalNombre: string;
  usuarioInicioId: number;
  usuarioInicioNombre: string;
  estado: EstadoTurnoCaja;
}
