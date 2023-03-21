import { Controller } from '@nestjs/common';
import {
  MessagePattern,
  RmqContext,
  Ctx,
  Payload,
  EventPattern,
} from '@nestjs/microservices';
import { AppService } from './app.service';
import { QueueEnum } from './queue.enum';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @MessagePattern(QueueEnum.ORDER)
  @EventPattern(QueueEnum.ORDER)
  public async execute(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('Msg recebida');
    const channel = context.getChannelRef();
    const orginalMessage = context.getMessage();
    console.log('data', data);
    channel.ack(orginalMessage);
  }
}
