import { MessageId } from 'types';

let counter = 0;

export const newMessageId = (): MessageId => {
  return `coong/${Date.now()}/${counter++}`;
};

export const isMessageId = (id: string) => {
  return id && id.startsWith('coong/');
};
