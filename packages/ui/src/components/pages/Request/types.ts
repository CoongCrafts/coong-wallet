import { WalletRequestEvent } from '@coong/base/types';

export interface CurrentRequestMessage {
  origin: string;
  data: WalletRequestEvent;
}
