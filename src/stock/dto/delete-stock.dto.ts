import { IsInt, IsOptional, IsString } from 'class-validator';

export class DeleteStockDto {
  @IsInt()
  stockId: number; // ID del stock que se va a eliminar

  @IsInt()
  productoId: number; // Producto asociado al stock eliminado

  @IsInt()
  sucursalId: number; // Sucursal donde estaba el stock

  @IsInt()
  usuarioId: number; // Usuario que realiza la eliminación

  @IsOptional()
  @IsString()
  motivo?: string; // Razón de la eliminación (opcional)
}
