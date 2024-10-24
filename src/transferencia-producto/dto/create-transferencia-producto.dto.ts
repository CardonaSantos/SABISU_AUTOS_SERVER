import { IsInt } from 'class-validator';

export class CreateTransferenciaProductoDto {
  @IsInt()
  productoId: number; // ID del producto que se va a transferir
  @IsInt()
  cantidad: number; // Cantidad a transferir
  @IsInt()
  sucursalOrigenId: number; // ID de la sucursal de origen
  @IsInt()
  sucursalDestinoId: number; // ID de la sucursal de destino
  @IsInt()
  usuarioEncargadoId: number; // ID del usuario que realiza la tr
}
