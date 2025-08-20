import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryCuentaBancariaDto {
  @IsOptional()
  @IsString()
  search?: string; // busca en banco, número, alias (icontains)

  @IsOptional()
  @IsBoolean()
  incluirInactivas?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
