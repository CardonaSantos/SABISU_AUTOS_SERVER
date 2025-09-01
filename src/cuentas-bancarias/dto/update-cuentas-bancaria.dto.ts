import { PartialType } from '@nestjs/mapped-types';

import { CreateCuentaBancariaDto } from './create-cuenta-bancaria.dto';
import { IsBoolean, IsOptional } from 'class-validator';
import { TipoCuentaBancaria } from '@prisma/client';

export class UpdateCuentaBancariaDto extends PartialType(
  CreateCuentaBancariaDto,
) {
  @IsOptional()
  @IsBoolean()
  activa?: boolean;

  tipo: TipoCuentaBancaria;
}
