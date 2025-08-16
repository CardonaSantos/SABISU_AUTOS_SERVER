import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class ResumenHistoricoQueryDto {
  @IsString()
  desde!: string; // YYYY-MM-DD

  @IsString()
  hasta!: string; // YYYY-MM-DD

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sucursalId?: number;
}
