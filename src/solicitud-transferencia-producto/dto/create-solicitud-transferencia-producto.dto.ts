import { EstadoSolicitudTransferencia } from 'prisma/generated/pos';
import { IsInt, IsOptional, IsString, IsEnum } from 'class-validator';

export class CreateSolicitudTransferenciaProductoDto {
  @IsInt()
  productoId: number;

  @IsInt()
  cantidad: number;

  @IsInt()
  sucursalOrigenId: number;

  @IsInt()
  sucursalDestinoId: number;

  @IsInt()
  usuarioSolicitanteId: number; // ID del usuario que realiza la solicitud

  @IsEnum(EstadoSolicitudTransferencia)
  @IsOptional()
  estado?: EstadoSolicitudTransferencia =
    EstadoSolicitudTransferencia.PENDIENTE;

  @IsString()
  @IsOptional()
  motivoRechazo?: string; // Motivo de rechazo, si aplica
}
