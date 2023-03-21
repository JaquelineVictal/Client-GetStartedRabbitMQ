import { Injectable, OnModuleInit } from '@nestjs/common';
import { Channel, connect } from 'amqplib';
import { PublishConfig } from './entities/publisher.entity';

@Injectable()
export class PublisherService implements OnModuleInit {
  private channel: Channel;
  async onModuleInit() {
    const connection = await connect(process.env.HOST);
    this.channel = await connection.createChannel();
  }
  public async publish(options: PublishConfig): Promise<boolean> {
    const data = JSON.stringify(options.data);
    const buffer = Buffer.from(data);

    return this.channel.publish('', options.queueName, buffer);
  }
}
