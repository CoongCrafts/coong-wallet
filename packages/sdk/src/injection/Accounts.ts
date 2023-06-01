import { InjectedAccount, Unsubcall } from '@polkadot/extension-inject/types';
import { assert } from '@coong/utils';
import ConnectedAccounts from '../ConnectedAccounts';
import CoongSdk from '../CoongSdk';
import { UpdatableInjectedAccounts } from '../types';

export default class Accounts implements UpdatableInjectedAccounts {
  #sdk: CoongSdk;

  constructor(sdk: CoongSdk) {
    this.#sdk = sdk;
  }

  async get(anyType?: boolean): Promise<InjectedAccount[]> {
    return this.connectedAccounts.ensureValue;
  }

  subscribe(cb: (accounts: InjectedAccount[]) => void | Promise<void>): Unsubcall {
    const subscription = this.connectedAccounts.onChange(cb);

    return () => subscription.unsubscribe();
  }

  async update(): Promise<InjectedAccount[]> {
    const { authorizedAccounts } = await this.#sdk.sendMessage({ name: 'tab/updateAccess' });

    this.connectedAccounts.save(authorizedAccounts);

    assert(authorizedAccounts.length > 0, 'No authorized accounts found!');

    return authorizedAccounts;
  }

  get connectedAccounts(): ConnectedAccounts {
    return this.#sdk.connectedAccounts;
  }
}
