import { PartialType } from '@nestjs/mapped-types';
import { CreateMetaDto } from './create-meta.dto';
import { CreateMetaUsuarioDto } from './MetaUsuarioDTO.dto';

export class UpdateMetaDto extends PartialType(CreateMetaUsuarioDto) {}
