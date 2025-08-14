import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PageOptionsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  readonly page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  readonly limit?: number = 10;
}
