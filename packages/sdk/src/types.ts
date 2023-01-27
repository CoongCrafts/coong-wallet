import { MessageId, RequestName, WalletRequest, WalletResponse } from '@coong/base/types';

export interface Handler {
  resolve: (data: any) => void;
  reject: (error: Error) => void;
  subscriber?: (data: any) => void;
}

export type Handlers = Record<MessageId, Handler>;

export interface SendMessage {
  <TRequestName extends RequestName>(request: WalletRequest<TRequestName>): Promise<WalletResponse<TRequestName>>;
}
