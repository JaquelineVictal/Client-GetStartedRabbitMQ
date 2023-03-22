import { Logger, OnModuleInit } from '@nestjs/common';
import { QueueEnum } from '../queue.enum';
import { ConsumerService } from './consumer.service';
import { AckFunc } from './cosumer.interface';

export abstract class AbstractConsumerService implements OnModuleInit {
  constructor(
    private readonly consumer: ConsumerService,
    protected queueName: QueueEnum,
    protected readonly logger: Logger,
  ) {}

  onModuleInit() {
    const fn = (data: any, processId: string, done: AckFunc) =>
      this._tryExecute(data, done, processId);
    this.consumer.onNewMessage(fn, this.queueName);
  }

  private async _tryExecute(
    request: any,
    done: AckFunc,
    processId: string,
  ): Promise<void> {
    return this.onNewMessage(request, processId)
      .catch((err) => {
        this.logger.error(err);
      })
      .finally(() => {
        done();
      });
  }

  protected onNewMessage(request: any, processId: string): Promise<void> {
    throw 'You need to implement Execute Method';
  }
}
