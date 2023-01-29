import {
  MessageId,
  MessageType,
  RequestName,
  WalletRequest,
  WalletRequestMessage,
  WalletResponse,
  WalletResponseMessage,
  WalletSignal,
  WalletSignalMessage,
  WalletSignals,
} from 'types';
import { isMessageId, newMessageId } from 'utils/messageId';

export const currentOrigin = () => {
  return window.location.origin;
};

export const newWalletRequest = (request: WalletRequest<RequestName>, id?: MessageId): WalletRequestMessage => {
  return {
    type: MessageType.REQUEST,
    id: id || newMessageId(),
    request,
    origin: currentOrigin(),
  };
};

export const newWalletResponse = (response: WalletResponse<RequestName>, id?: MessageId): WalletResponseMessage => {
  return {
    type: MessageType.RESPONSE,
    id: id || newMessageId(),
    response,
    origin: currentOrigin(),
  };
};

export const newWalletErrorResponse = (error: string, id?: MessageId): WalletResponseMessage => {
  return {
    type: MessageType.RESPONSE,
    id: id || newMessageId(),
    error,
    origin: currentOrigin(),
  };
};

export const newWalletSignal = (signal: WalletSignal, id?: MessageId): WalletSignalMessage => {
  return {
    type: MessageType.SIGNAL,
    id: id || newMessageId(),
    signal,
    origin: currentOrigin(),
  };
};

export const isWalletRequest = (event: WalletRequestMessage) => {
  const { id, type, request } = event;
  return isMessageId(id) && type === MessageType.REQUEST && request;
};

export const isWalletResponse = (event: WalletResponseMessage) => {
  const { id, type, response, error } = event;
  return isMessageId(id) && type === MessageType.RESPONSE && (response || error);
};

export const isWalletSignal = (event: WalletSignalMessage) => {
  const { id, type, signal } = event;
  return isMessageId(id) && type === MessageType.SIGNAL && WalletSignals.includes(signal);
};
