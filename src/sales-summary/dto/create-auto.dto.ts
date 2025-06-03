import { ResumenPeriodo } from '@prisma/client';

export class CreateAutoSummary {
  periodo: ResumenPeriodo;
  sucursalId: number;
  usuarioId: number;
}
