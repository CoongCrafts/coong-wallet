import { InjectedAccount, InjectedAccounts, Unsubcall } from '@polkadot/extension-inject/types';
import { SendMessage } from 'types';

let sendMessage: SendMessage;

export default class Accounts implements InjectedAccounts {
  constructor(_sendMessage: SendMessage) {
    sendMessage = _sendMessage;
  }

  get(anyType?: boolean): Promise<InjectedAccount[]> {
    return sendMessage({ name: 'embed/authorizedAccounts', body: { anyType } });
  }

  subscribe(cb: (accounts: InjectedAccount[]) => void | Promise<void>): Unsubcall {
    // TODO add subscription
    return () => {};
  }
}
