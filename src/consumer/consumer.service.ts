import { Inject, Injectable, Logger } from '@nestjs/common';
import { Channel, connect, ConsumeMessage } from 'amqplib';
import { QueueEnum } from 'src/queue.enum';
import { PublisherService } from '../publisher/publisher.service';
import { ConsumerRunFn } from './cosumer.interface';

@Injectable()
export class ConsumerService {
  private readonly logger = new Logger('MessageQueueConsumerService');

  constructor(
    @Inject('CONFIG') private config: string,
    private publisher: PublisherService,
  ) {}

  public async onNewMessage(
    fn: ConsumerRunFn,
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
    channel.consume(queueName, (msg) => this.tryConsume(msg, fn, channel), {
      noAck: false,
    });
  }

  private async tryConsume(
    msg: ConsumeMessage,
    fn: ConsumerRunFn,
    channel: Channel,
  ) {
    try {
      await this.consume(msg, fn, channel);
    } catch (err) {
      this.logger.log(`Something went wrong, call The Batman`);
    }
  }

  private async consume(
    msg: ConsumeMessage,
    fn: ConsumerRunFn,
    channel: Channel,
  ) {
    const processId = msg.properties.headers['process_id'];
    const parsedData = JSON.parse(msg.content.toString());
    console.log({ parsedData });
    return fn(
      parsedData,
      processId,
      () => this.ack(msg, channel),
      msg.fields.redelivered,
    );
  }

  private ack(msg: ConsumeMessage, channel: Channel) {
    channel.ack(msg);
  }
}
