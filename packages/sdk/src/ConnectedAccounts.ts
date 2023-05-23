import { InjectedAccount } from '@polkadot/extension-inject/types';
import { assert } from '@coong/utils';
import { BehaviorSubject, Subscription } from 'rxjs';

const CONNECTED_ACCOUNTS_KEY_PREFIX = 'COONGWALLET_CONNECTED_ACCOUNTS';

export default class ConnectedAccounts {
  #walletUrl: string;
  #accounts: BehaviorSubject<InjectedAccount[]>;

  constructor(walletUrl: string) {
    this.#walletUrl = walletUrl;
    this.#accounts = new BehaviorSubject<InjectedAccount[]>(this.#loadFromStorage());

    // save to storage on accounts change
    this.#accounts.subscribe((authorizedAccounts) => {
      const key = this.storageKey;
      if (!localStorage.getItem(key) && authorizedAccounts.length === 0) {
        return;
      }

      localStorage.setItem(key, JSON.stringify(authorizedAccounts));
    });
  }

  get value(): InjectedAccount[] {
    return this.#accounts.value;
  }

  get ensureValue(): InjectedAccount[] {
    this.ensureConnected();

    return this.value;
  }

  get connected(): boolean {
    return this.value.length > 0;
  }

  ensureConnected(): boolean {
    assert(this.connected, 'No authorized accounts found!');

    return true;
  }

  save(accounts: InjectedAccount[]) {
    this.#accounts.next(accounts);
  }

  clear() {
    this.#accounts.next([]);
    localStorage.removeItem(this.storageKey);
  }

  onChange(cb: (accounts: InjectedAccount[]) => void): Subscription {
    return this.#accounts.subscribe(cb);
  }

  get storageKey() {
    return `${CONNECTED_ACCOUNTS_KEY_PREFIX}:${this.#walletUrl}`;
  }

  #loadFromStorage() {
    const raw = localStorage.getItem(this.storageKey) as string;
    if (!raw) {
      return [];
    }

    try {
      return JSON.parse(raw) as InjectedAccount[];
    } catch (e: any) {
      return [];
    }
  }
}
