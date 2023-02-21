import { Injected } from '@polkadot/extension-inject/types';
import { SendMessage } from '../types';
import Accounts from './Accounts';
import CoongSigner from './CoongSigner';

export default class SubstrateInjected implements Injected {
  public readonly accounts: Accounts;
  public readonly signer: CoongSigner;

  constructor(sendMessage: SendMessage) {
    this.accounts = new Accounts(sendMessage);
    this.signer = new CoongSigner(sendMessage);
  }
}
