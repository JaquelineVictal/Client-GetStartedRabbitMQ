import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Channel, connect, ConsumeMessage } from 'amqplib';
import { QueueEnum } from 'src/queue.enum';
import { Items, OrderEntity } from './cosumer.interface';

@Injectable()
export class ConsumerService implements OnModuleInit {
  queueName: QueueEnum = QueueEnum.ORDER;
  logger: Logger = new Logger();

  constructor(@Inject('CONFIG') private config: string) {}

  onModuleInit() {
    this.onNewMessage(this.queueName);
  }

  public async onNewMessage(
    queueName: QueueEnum,
    prefetchQuantity = 1,
  ): Promise<any> {
    const connection = await connect(this.config);
    const channel: Channel = await connection.createChannel();
    channel.prefetch(prefetchQuantity);

    await channel.assertQueue(queueName, {
      arguments: {
        'x-message-deduplication': true,
      },
    });

    this.logger.log(`Listening to messages on queue ${queueName}`);
    channel.consume(queueName, (msg) => this.tryConsume(msg, channel), {
      noAck: false,
    });
  }

  private async tryConsume(msg: ConsumeMessage, channel: Channel) {
    try {
      await this.consume(msg, channel);
    } catch (err) {
      this.logger.log(`Something went wrong, call The Batman`);
    }
  }

  private async consume(msg: ConsumeMessage, channel: Channel) {
    const parsedData: OrderEntity = JSON.parse(msg.content.toString());
    const itemsString = this.formatItemsOrder(parsedData.items);
    console.log(
      `Novo pedido (Nº${parsedData.orderId}) recebido. Separe os seguintes itens: ${itemsString}`,
    );
    this.ack(msg, channel);
  }

  private ack(msg: ConsumeMessage, channel: Channel) {
    channel.ack(msg);
  }
  private formatItemsOrder(items: Items[]): string {
    return items
      .map((item) => {
        return `${item.product} => ${item.quantity} unidade(s)`;
      })
      .join(', ');
  }
}
