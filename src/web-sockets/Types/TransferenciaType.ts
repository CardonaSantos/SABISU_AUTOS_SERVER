import { EstadoSolicitudTransferencia } from '@prisma/client';

export interface solicitudTransferencia {
  id: number;
  productoId: number;
  cantidad: number;
  sucursalOrigenId: number;
  sucursalDestinoId: number;
  usuarioSolicitanteId: number | null;
  estado: EstadoSolicitudTransferencia;
  fechaSolicitud: Date;
  fechaAprobacion: Date | null;
  administradorId: number | null;
}
