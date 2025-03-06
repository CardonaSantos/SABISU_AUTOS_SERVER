import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
// import { TipoNotificacion } from '@prisma/client';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(
      createNotificationDto.mensaje,
      createNotificationDto.remitenteId,
      createNotificationDto.usuarioId, // ahora es un array de IDs
      createNotificationDto.tipoNotificacion,
      createNotificationDto.referenciaId,
    );
  }

  @Get()
  findAll() {
    return this.notificationService.findAll();
  }

  @Get('/get-my-notifications/:id')
  getMyNotifications(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.getMyNotifications(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(+id, updateNotificationDto);
  }

  @Delete('/delete-my-notification/:idNotification/:idUser')
  removeMyNotifi(
    @Param('idNotification', ParseIntPipe) idNotification: number,
    @Param('idUser', ParseIntPipe) idUser: number,
  ) {
    console.log('Los datos llegando al controller de notificaciones son: ');
    console.log(idNotification);
    console.log(idUser);

    return this.notificationService.deleteNotification(idNotification, idUser);
  }

  @Delete('/delete-all')
  removeall() {
    return this.notificationService.removeall();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }
}
