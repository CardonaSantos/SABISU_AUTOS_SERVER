import { Injectable } from '@nestjs/common';
import { CreateClientRemoveDto } from './dto/create-client-remove.dto';
import { UpdateClientRemoveDto } from './dto/update-client-remove.dto';

@Injectable()
export class ClientRemoveService {
  create(createClientRemoveDto: CreateClientRemoveDto) {
    return 'This action adds a new clientRemove';
  }

  findAll() {
    return `This action returns all clientRemove`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clientRemove`;
  }

  update(id: number, updateClientRemoveDto: UpdateClientRemoveDto) {
    return `This action updates a #${id} clientRemove`;
  }

  remove(id: number) {
    return `This action removes a #${id} clientRemove`;
  }
}
