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
  }
  public async publish(options: PublishConfig): Promise<boolean> {
    const data = JSON.stringify(options.data);
    const buffer = Buffer.from(data);

    return this.channel.publish('', options.queueName, buffer);
  }
}
