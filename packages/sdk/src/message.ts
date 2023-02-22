import { injectExtension } from '@polkadot/extension-inject';
import { Injected, InjectedAccount } from '@polkadot/extension-inject/types';
import { isWalletResponse, newMessageId, newWalletRequest } from '@coong/base';
import { RequestName, WalletRequest, WalletResponse, WalletResponseMessage } from '@coong/base/types';
import { assert } from '@coong/utils';
import CoongSdk from './CoongSdk';
import SubstrateInjected from './injection/Injected';
import { Handlers } from './types';
import WalletInstance from './wallet/WalletInstance';

const handlers: Handlers = {};

export const setupWalletMessageHandler = (walletUrl?: string) => {
  walletUrl = walletUrl || '*';

  window.addEventListener('message', (event: MessageEvent<WalletResponseMessage>) => {
    const { origin, data } = event;
    if (origin !== walletUrl) {
      return;
    }

    if (!isWalletResponse(data)) {
      return;
    }

    const { id, error, response } = data;

    const handler = handlers[id];

    if (!handler) {
      console.error('Unknown response ', data);
      return;
    }

    const { resolve, reject } = handler;

    if (!handler.subscriber) {
      delete handlers[id];
    }

    // TODO handle subscriptions

    if (error) {
      reject(new Error(error));
    } else {
      resolve(response);
    }
  });
};

export function sendMessage<TRequestName extends RequestName>(
  request: WalletRequest<TRequestName>,
): Promise<WalletResponse<TRequestName>> {
  return new Promise<WalletResponse<TRequestName>>((resolve, reject) => {
    assert(CoongSdk.instance().initialized, 'CoongSdk has not been initialized!');

    const id = newMessageId();
    handlers[id] = {
      resolve,
      reject,
    };

    const messageBody = newWalletRequest(request, id);

    CoongSdk.instance()
      .sendMessageToWallet(messageBody)
      .catch((error) => {
        console.error(error);
        delete handlers[id];

        reject();
      });
  });
}

const AUTHORIZED_ACCOUNTS_KEY = 'coongwallet:AUTHORIZED_ACCOUNTS';

export const getAuthorizedAccounts = (): InjectedAccount[] => {
  try {
    const authorizedAccounts = localStorage.getItem(AUTHORIZED_ACCOUNTS_KEY) || '[]';
    return JSON.parse(authorizedAccounts) as InjectedAccount[];
  } catch {
    return [];
  }
};

export const enable = async (appName: string): Promise<Injected> => {
  const authorizedAccounts = getAuthorizedAccounts();
  if (authorizedAccounts.length === 0) {
    const response = await sendMessage({ name: 'tab/requestAccess', body: { appName } });
    localStorage.setItem(AUTHORIZED_ACCOUNTS_KEY, JSON.stringify(response.authorizedAccounts));
  }

  return new SubstrateInjected(sendMessage);
};

export const injectWalletAPI = (walletInstance: WalletInstance) => {
  const walletInfo = walletInstance.walletInfo;
  assert(walletInfo, `Unknown wallet info!`);

  const { name, version } = walletInfo!;

  injectExtension(enable, {
    name,
    version,
  });
};
