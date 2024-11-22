import { PartialType } from '@nestjs/mapped-types';
import { CreateSucursalSaldoDto } from './create-sucursal-saldo.dto';

export class UpdateSucursalSaldoDto extends PartialType(CreateSucursalSaldoDto) {}
