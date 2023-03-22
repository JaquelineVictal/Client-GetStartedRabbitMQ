import { Module, DynamicModule } from '@nestjs/common';
import { ConsumerService } from 'src/consumer/consumer.service';
import { PublisherService } from 'src/publisher/publisher.service';

@Module({
  providers: [PublisherService, ConsumerService],
})
export class RabbitMqModule {
  static forRoot(config: string): DynamicModule {
    return {
      module: RabbitMqModule,
      imports: [],
      providers: [
        {
          provide: 'CONFIG',
          useValue: config,
        },
        PublisherService,
        ConsumerService,
      ],
      exports: [PublisherService, ConsumerService],
    };
  }
}
