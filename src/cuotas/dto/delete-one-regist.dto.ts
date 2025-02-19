import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class DeleteOneRegistCreditDto {
  @IsString()
  @IsNotEmpty()
  passwordAdmin: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  sucursalId: number;

  @IsNumber()
  @IsNotEmpty()
  creditId: number;
}
