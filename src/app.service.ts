import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { AbstractConsumerService } from './consumer/abstract-message-consume.service';
import { ConsumerService } from './consumer/consumer.service';
import { PublisherService } from './publisher/publisher.service';
import { QueueEnum } from './queue.enum';

@Injectable()
export class AppService
  extends AbstractConsumerService
  implements OnModuleInit
{
  constructor(
    consumerService: ConsumerService,
    private readonly publisherService: PublisherService,
  ) {
    const queue = QueueEnum.ORDER;

    super(consumerService, queue, new Logger('Queue Order'));
  }

  async onNewMessage(): Promise<void> {
    try {
      console.log('Entrou na Leitura da Mensagem');
    } catch (err) {
      console.log(`Something went wrong, call The Batman`);
    }
  }
}
