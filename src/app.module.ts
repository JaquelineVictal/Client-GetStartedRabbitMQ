import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsumerModule } from './consumer/consumer.module';
import { RabbitMqModule } from './rabbit-mq/rabbit-mq.module';

@Module({
  imports: [RabbitMqModule.forRoot(process.env.HOST)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
