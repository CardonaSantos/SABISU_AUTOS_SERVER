import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DeleteCuotaPaymentDTO {
  @IsNumber()
  @IsNotEmpty()
  sucursalID: number;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsNumber()
  cuotaID: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
