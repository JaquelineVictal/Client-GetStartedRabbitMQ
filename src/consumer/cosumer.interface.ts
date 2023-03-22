export type ConsumerRunFn = (
  data: any,
  processId: string,
  done: AckFunc,
  redelievered: boolean,
) => Promise<any>;
export type AckFunc = () => void;
