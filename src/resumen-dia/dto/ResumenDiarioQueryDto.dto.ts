import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class ResumenDiarioQueryDto {
  @IsOptional()
  @IsString()
  fecha?: string; // YYYY-MM-DD

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sucursalId?: number;
}
