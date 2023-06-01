import CoongSdk from '../CoongSdk';
import { UpdatableInjected } from '../types';
import Accounts from './Accounts';
import CoongSigner from './CoongSigner';

export default class SubstrateInjected implements UpdatableInjected {
  public readonly accounts: Accounts;
  public readonly signer: CoongSigner;

  constructor(sdk: CoongSdk) {
    sdk.ensureSdkInitialized();

    this.accounts = new Accounts(sdk);
    this.signer = new CoongSigner(sdk);
  }
}
