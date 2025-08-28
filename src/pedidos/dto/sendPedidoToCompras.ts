import { IsInt } from 'class-validator';

export class ReceivePedidoComprasDto {
  @IsInt()
  proveedorId: number;
  @IsInt()
  pedidoId: number;

  @IsInt()
  userID: number;
  @IsInt()
  sucursalId: number;
}
