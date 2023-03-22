import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Channel, connect } from 'amqplib';
import { QueueEnum } from 'src/queue.enum';
import { PublishConfig } from './entities/publisher.entity';

@Injectable()
export class PublisherService implements OnModuleInit {
  constructor(@Inject('CONFIG') private config: string) {}
  private channel: Channel;
  async onModuleInit() {
    const connection = await connect(this.config);
    this.channel = await connection.createChannel();
    await this.createAllQueues();
  }
  private async createAllQueues() {
    for (const queueName of Object.values(QueueEnum)) {
      await this.channel.assertQueue(queueName, {
        arguments: {
          'x-message-deduplication': true,
        },
      });
    }
  }
  public async publish(options: PublishConfig): Promise<boolean> {
    const data = JSON.stringify(options.data);
    const buffer = Buffer.from(data);

    return this.channel.publish('', options.queueName, buffer);
  }
}
