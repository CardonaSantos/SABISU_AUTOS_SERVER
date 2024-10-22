import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaDto } from './create-categoria.dto';
import { IsString } from 'class-validator';

export class UpdateCategoriaDto {
  @IsString()
  nombre: string;
}
