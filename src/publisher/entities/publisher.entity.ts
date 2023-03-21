import { QueueEnum } from 'src/queue.enum';

export class Publisher {}

export type PublishConfig<T = any> = {
  data: T;
  queueName: QueueEnum;
};
