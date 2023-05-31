import CoongSdk from '../CoongSdk';
import { SendMessage, UpdatableInjected } from '../types';
import Accounts from './Accounts';
import CoongSigner from './CoongSigner';

export default class SubstrateInjected implements UpdatableInjected {
  public readonly accounts: Accounts;
  public readonly signer: CoongSigner;

  constructor(sendMessage: SendMessage, sdk: CoongSdk) {
    sdk.ensureSdkInitialized();

    this.accounts = new Accounts(sendMessage, sdk);
    this.signer = new CoongSigner(sendMessage);
  }
}
