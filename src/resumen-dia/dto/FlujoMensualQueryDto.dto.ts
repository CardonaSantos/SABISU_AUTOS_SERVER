import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class FlujoMensualQueryDto {
  @IsString()
  mes!: string; // YYYY-MM

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sucursalId?: number;
}
