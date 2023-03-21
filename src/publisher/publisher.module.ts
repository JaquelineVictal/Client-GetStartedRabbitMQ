import { Module } from '@nestjs/common';
import { PublisherService } from './publisher.service';

@Module({
  controllers: [],
  providers: [PublisherService],
})
export class PublisherModule {}
