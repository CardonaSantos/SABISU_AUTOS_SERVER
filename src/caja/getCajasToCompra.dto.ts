import { IsInt } from 'class-validator';

export class getCajasToCompraDto {
  @IsInt()
  sucursalId: number;

  @IsInt()
  userId: number;

  @IsInt()
  registroCaja: number;
}
