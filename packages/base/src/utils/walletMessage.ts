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
  WalletSignals,
} from 'types';
import { isMessageId, newMessageId } from 'utils/messageId';

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

export const isWalletRequest = (event: WalletRequestEvent) => {
  const { id, type, request } = event;
  return isMessageId(id) && type === MessageType.REQUEST && request;
};

export const isWalletResponse = (event: WalletResponseEvent) => {
  const { id, type, response, error } = event;
  return isMessageId(id) && type === MessageType.RESPONSE && (response || error);
};

export const isWalletSignal = (event: WalletSignalEvent) => {
  const { id, type, signal } = event;
  return isMessageId(id) && type === MessageType.SIGNAL && WalletSignals.includes(signal);
};
