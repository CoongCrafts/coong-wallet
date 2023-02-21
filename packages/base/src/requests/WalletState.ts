import { TypeRegistry } from '@polkadot/types';
import { SignerPayloadJSON } from '@polkadot/types/types';
import { encodeAddress } from '@polkadot/util-crypto';
import { defaultNetwork } from '@coong/base';
import { assert, StandardCoongError } from '@coong/utils';
import { BehaviorSubject } from 'rxjs';
import keyring from '../keyring';
import {
  AccessStatus,
  RequestAppRequestAccess,
  RequestName,
  WalletRequestMessage,
  WalletRequestWithResolver,
  WalletResponse,
} from '../types';

export type AppId = string;
export interface AppInfo {
  name: string;
  url: string;
  authorizedAccounts: string[];
}
export type AuthorizedApps = Record<AppId, AppInfo>;

const AUTHORIZED_ACCOUNTS_KEY = 'AUTHORIZED_ACCOUNTS';
const URL_PROTOCOLS = ['http://', 'https://'];

type NullableRequestWithResolver = WalletRequestWithResolver | null;

export default class WalletState {
  #authorizedApps: AuthorizedApps = {};
  #requestMessageSubject: BehaviorSubject<NullableRequestWithResolver> =
    new BehaviorSubject<NullableRequestWithResolver>(null);

  constructor() {
    this.#loadAuthorizedAccounts();

    window.addEventListener('storage', (event) => {
      if (event.key === AUTHORIZED_ACCOUNTS_KEY) {
        this.#loadAuthorizedAccounts();
      }
    });
  }

  #loadAuthorizedAccounts() {
    const authorizedAccountsString = localStorage.getItem(AUTHORIZED_ACCOUNTS_KEY) || '{}';
    this.#authorizedApps = JSON.parse(authorizedAccountsString) as AuthorizedApps;
  }

  #saveAuthorizedApps() {
    localStorage.setItem(AUTHORIZED_ACCOUNTS_KEY, JSON.stringify(this.#authorizedApps));
  }

  extractAppId(url: string) {
    assert(url && URL_PROTOCOLS.some((protocol) => url.startsWith(protocol)), `Invalid url: ${url}`);

    return url.split('//')[1];
  }

  getAuthorizedApp(url: string): AppInfo {
    const appInfo = this.#authorizedApps[this.extractAppId(url)];

    assert(appInfo, `The app at ${url} has not been authorized yet!`);

    return appInfo;
  }

  ensureAppAuthorized(url: string): boolean {
    return !!this.getAuthorizedApp(url);
  }

  ensureAccountAuthorized(url: string, accountAddress: string): void {
    const app = this.getAuthorizedApp(url);
    const substrateAddress = encodeAddress(accountAddress, defaultNetwork.prefix);

    assert(
      app.authorizedAccounts.includes(substrateAddress),
      `The app at ${url} is not authorized to access account with address ${accountAddress}!`,
    );
  }

  getCurrentRequestMessage = (requestName?: RequestName) => {
    const currentRequestMessage = this.#requestMessageSubject.value;
    if (!currentRequestMessage) {
      throw new StandardCoongError('No request message available');
    }

    if (requestName && currentRequestMessage?.request.name !== requestName) {
      throw new StandardCoongError('Invalid request name');
    }

    return currentRequestMessage;
  };

  approveRequestAccess(authorizedAccounts: string[]) {
    const currentMessage = this.getCurrentRequestMessage('tab/requestAccess');

    const { origin: url, request, resolve } = currentMessage;
    const requestBody = request.body as RequestAppRequestAccess;

    const appId = this.extractAppId(url);
    const existingApp = this.#authorizedApps[appId];

    if (existingApp) {
      resolve({
        result: AccessStatus.APPROVED,
        authorizedAccounts: existingApp.authorizedAccounts,
      });
    }

    assert(authorizedAccounts && authorizedAccounts.length, 'Please choose at least one account to connect');

    this.#authorizedApps[appId] = {
      name: requestBody.appName,
      url,
      authorizedAccounts,
    };

    this.#saveAuthorizedApps();

    resolve({
      result: AccessStatus.APPROVED,
      authorizedAccounts,
    });
  }

  rejectRequestAccess = () => {
    const currentRequestMessage = this.getCurrentRequestMessage('tab/requestAccess');
    currentRequestMessage.reject(new StandardCoongError(AccessStatus.DENIED));
  };

  async approveSignExtrinsic(password: string) {
    await keyring.verifyPassword(password);

    const currentMessage = this.getCurrentRequestMessage('tab/signExtrinsic');

    const { id, request, resolve } = currentMessage;
    const payloadJSON = request.body as SignerPayloadJSON;

    const pair = keyring.getSigningPair(payloadJSON.address);
    pair.unlock();

    const registry = new TypeRegistry();
    registry.setSignedExtensions(payloadJSON.signedExtensions);
    const payload = registry.createType('ExtrinsicPayload', payloadJSON, { version: payloadJSON.version });
    const result = payload.sign(pair);

    resolve({
      id,
      ...result,
    });
  }

  cancelSignExtrinsic() {
    const currentMessage = this.getCurrentRequestMessage('tab/signExtrinsic');

    currentMessage.reject(new StandardCoongError('Cancelled'));
  }

  async newRequestMessage<TRequestName extends RequestName>(
    message: WalletRequestMessage<TRequestName>,
  ): Promise<WalletResponse<TRequestName>> {
    return new Promise<WalletResponse<TRequestName>>((resolve, reject) => {
      this.#requestMessageSubject.next({
        ...message,
        reject,
        resolve,
      });
    });
  }

  subscribeToNewRequestMessage = (onNewRequest: (request: WalletRequestWithResolver) => void): (() => void) => {
    const subscription = this.#requestMessageSubject.subscribe((nextRequest) => {
      nextRequest && onNewRequest(nextRequest);
    });

    return subscription.unsubscribe.bind(subscription);
  };

  reset() {
    localStorage.removeItem(AUTHORIZED_ACCOUNTS_KEY);
  }

  reloadState() {
    this.#loadAuthorizedAccounts();
  }
}
