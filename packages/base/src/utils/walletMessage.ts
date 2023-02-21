import {
  MessageId,
  MessageType,
  WalletInfo,
  WalletRequest,
  WalletRequestMessage,
  WalletResponse,
  WalletResponseMessage,
  WalletSignal,
  WalletSignalMessage,
  WalletSignals,
} from '../types';
import { isMessageId, newMessageId } from '../utils';

export const currentOrigin = () => {
  return window.location.origin;
};

export const newWalletRequest = (request: WalletRequest, id?: MessageId): WalletRequestMessage => {
  return {
    type: MessageType.REQUEST,
    id: id || newMessageId(),
    request,
    origin: currentOrigin(),
  };
};

export const newWalletResponse = (response: WalletResponse, id?: MessageId): WalletResponseMessage => {
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

export const newWalletSignal = (signal: WalletSignal, walletInfo: WalletInfo): WalletSignalMessage => {
  return {
    type: MessageType.SIGNAL,
    id: newMessageId(),
    signal,
    origin: currentOrigin(),
    walletInfo,
  };
};

export const isWalletRequest = (message?: WalletRequestMessage) => {
  if (!message) {
    return false;
  }

  const { id, type, origin, request } = message;
  return origin && isMessageId(id) && type === MessageType.REQUEST && request;
};

export const isWalletResponse = (message?: WalletResponseMessage) => {
  if (!message) {
    return false;
  }

  const { id, type, origin, response, error } = message;
  return origin && isMessageId(id) && type === MessageType.RESPONSE && (response || error);
};

export const isWalletSignal = (message?: WalletSignalMessage) => {
  if (!message) {
    return false;
  }

  const { id, type, origin, signal, walletInfo } = message;
  return origin && isMessageId(id) && type === MessageType.SIGNAL && WalletSignals.includes(signal) && !!walletInfo;
};

export const compareWalletInfo = (info1?: WalletInfo, info2?: WalletInfo) => {
  if (!info1 || !info2) {
    return false;
  }

  return info1.name === info2.name && info1.version === info2.version && info1.instanceId === info2.instanceId;
};
