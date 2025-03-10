import { EstadoSolicitud } from '@prisma/client';

export interface nuevaSolicitud {
  id: number;
  productoId: number;
  precioSolicitado: number;
  solicitadoPorId: number;
  estado: EstadoSolicitud;
  aprobadoPorId: number | null;
  fechaSolicitud: Date;
  fechaRespuesta: Date | null;
}
