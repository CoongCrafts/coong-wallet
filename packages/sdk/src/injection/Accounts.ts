import { InjectedAccount, Unsubcall } from '@polkadot/extension-inject/types';
import { assert } from '@coong/utils';
import ConnectedAccounts from '../ConnectedAccounts';
import CoongSdk from '../CoongSdk';
import { SendMessage, UpdatableInjectedAccounts } from '../types';

let sendMessage: SendMessage;

export default class Accounts implements UpdatableInjectedAccounts {
  #connectedAccounts: ConnectedAccounts;
  constructor(_sendMessage: SendMessage, sdk: CoongSdk) {
    sendMessage = _sendMessage;

    this.#connectedAccounts = sdk.connectedAccounts;
  }

  async get(anyType?: boolean): Promise<InjectedAccount[]> {
    return this.#connectedAccounts.ensureValue;
  }

  subscribe(cb: (accounts: InjectedAccount[]) => void | Promise<void>): Unsubcall {
    const subscription = this.#connectedAccounts.onChange(cb);

    return () => subscription.unsubscribe();
  }

  async update(): Promise<InjectedAccount[]> {
    const { authorizedAccounts } = await sendMessage({ name: 'tab/updateAccess' });

    this.#connectedAccounts.save(authorizedAccounts);

    assert(authorizedAccounts.length > 0, 'No authorized accounts found!');

    return authorizedAccounts;
  }
}
