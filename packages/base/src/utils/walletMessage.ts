import {
  MessageId,
  MessageType,
  RequestName,
  WalletRequest,
  WalletRequestEvent,
  WalletResponse,
  WalletResponseEvent,
  WalletSignal,
  WalletSignalEvent,
} from 'types';
import { newMessageId } from 'utils/messageId';

export const newWalletRequest = (request: WalletRequest<RequestName>, id?: MessageId): WalletRequestEvent => {
  return {
    type: MessageType.REQUEST,
    id: id || newMessageId(),
    request,
  };
};

export const newWalletResponse = (response: WalletResponse<RequestName>, id?: MessageId): WalletResponseEvent => {
  return {
    type: MessageType.RESPONSE,
    id: id || newMessageId(),
    response,
  };
};

export const newWalletErrorResponse = (error: string, id?: MessageId): WalletResponseEvent => {
  return {
    type: MessageType.RESPONSE,
    id: id || newMessageId(),
    error,
  };
};

export const newWalletSignal = (signal: WalletSignal, id?: MessageId): WalletSignalEvent => {
  return {
    type: MessageType.SIGNAL,
    id: id || newMessageId(),
    signal,
  };
};
