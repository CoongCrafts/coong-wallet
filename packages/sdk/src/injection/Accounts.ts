import { InjectedAccount, InjectedAccounts, Unsubcall } from '@polkadot/extension-inject/types';
import { getAuthorizedAccounts } from '../message';
import { SendMessage } from '../types';

let sendMessage: SendMessage;

export default class Accounts implements InjectedAccounts {
  constructor(_sendMessage: SendMessage) {
    sendMessage = _sendMessage;
  }

  get(anyType?: boolean): Promise<InjectedAccount[]> {
    return Promise.resolve(getAuthorizedAccounts());
  }

  subscribe(cb: (accounts: InjectedAccount[]) => void | Promise<void>): Unsubcall {
    // Not support subscription for now!
    return () => {};
  }
}
