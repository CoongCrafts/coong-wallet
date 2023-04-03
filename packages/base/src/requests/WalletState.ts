import { InjectedAccount } from '@polkadot/extension-inject/types';
import { TypeRegistry } from '@polkadot/types';
import { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import { u8aToHex, u8aWrapBytes } from '@polkadot/util';
import { encodeAddress } from '@polkadot/util-crypto';
import { KeypairType } from '@polkadot/util-crypto/types';
import Keyring from '@coong/keyring';
import { assert, StandardCoongError } from '@coong/utils';
import { BehaviorSubject } from 'rxjs';
import { defaultNetwork } from '../networks';
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

export const AUTHORIZED_ACCOUNTS_KEY = 'AUTHORIZED_ACCOUNTS';
export const URL_PROTOCOLS = ['http://', 'https://'];

type NullableRequestWithResolver = WalletRequestWithResolver | null;

export function canDerive(type?: KeypairType): boolean {
  return !!type && ['ed25519', 'sr25519', 'ecdsa', 'ethereum'].includes(type);
}

/**
 * @name WalletState
 * @description Internal state of the wallet which abstracts away
 * logic to interact with wallet via messages
 */
export default class WalletState {
  readonly #keyring: Keyring;
  #authorizedApps: AuthorizedApps = {};
  #requestMessageSubject: BehaviorSubject<NullableRequestWithResolver> =
    new BehaviorSubject<NullableRequestWithResolver>(null);

  constructor(keyring: Keyring) {
    this.#keyring = keyring;

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

  async getInjectedAccounts(anyType = false): Promise<InjectedAccount[]> {
    const accounts = await this.#keyring.getAccounts();
    return accounts
      .filter(({ type }) => (anyType ? true : canDerive(type)))
      .map(({ address, genesisHash, name, type }) => ({ address, genesisHash, name, type }));
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
    const { origin: url, request, resolve } = this.getCurrentRequestMessage('tab/requestAccess');

    const requestBody = request.body as RequestAppRequestAccess;

    const appId = this.extractAppId(url);
    const existingApp = this.#authorizedApps[appId];
    if (existingApp) {
      const newAccounts = authorizedAccounts.filter((one) => !existingApp.authorizedAccounts.includes(one));
      authorizedAccounts = newAccounts.concat(existingApp.authorizedAccounts);
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
    const { reject } = this.getCurrentRequestMessage('tab/requestAccess');
    reject(new StandardCoongError(AccessStatus.DENIED));
  };

  async approveSignExtrinsic(password: string) {
    await this.#keyring.verifyPassword(password);

    const currentMessage = this.getCurrentRequestMessage('tab/signExtrinsic');

    const { id, request, resolve } = currentMessage;
    const payloadJSON = request.body as SignerPayloadJSON;

    const pair = this.#keyring.getSigningPair(payloadJSON.address);
    pair.unlock(password);

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

  async signRawMessage(password: string) {
    await this.#keyring.verifyPassword(password);

    const currentMessage = this.getCurrentRequestMessage('tab/signRaw');

    const { id, request, resolve } = currentMessage;
    const payloadJSON = request.body as SignerPayloadRaw;

    const pair = this.#keyring.getSigningPair(payloadJSON.address);
    pair.unlock(password);

    const signature = u8aToHex(pair.sign(u8aWrapBytes(payloadJSON.data)));

    resolve({
      id,
      signature,
    });
  }

  cancelSignRawMessage() {
    const currentMessage = this.getCurrentRequestMessage('tab/signRaw');
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
    this.keyring.reload();
  }

  get keyring() {
    return this.#keyring;
  }
}
