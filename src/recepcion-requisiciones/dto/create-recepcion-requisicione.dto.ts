import { IsBoolean, IsIn, IsInt, IsNumber } from 'class-validator';

export class CreateRecepcionRequisicioneDto {
  @IsInt()
  @IsNumber()
  requisicionLineaId: number; // referencia a la línea original (para trazabilidad)
  @IsInt()
  @IsNumber()
  productoId: number; // id del producto recibido
  @IsInt()
  @IsNumber()
  cantidadSolicitada: number; // cantidad que se solicitó (puede ser útil para validación)
  @IsNumber()
  cantidadRecibida: number; // cantidad que realmente se recibió
  @IsNumber()
  precioUnitario?: number; // opcional, si se necesita actualizar o confirmar precio
  @IsBoolean()
  ingresadaAStock?: boolean; // si ya se ingresó al stock (por defecto true)
}
