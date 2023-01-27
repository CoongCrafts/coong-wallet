import { WalletSignal } from '@coong/base/types';
import { StandardCoongError } from '@coong/utils';
import WalletInstance from 'wallet/WalletInstance';

export default class TabInstance extends WalletInstance {
  async openWalletWindow(path = ''): Promise<Window> {
    this.registerEvent();

    const tabWalletWindow = window.open(`${this.walletUrl}${path}`);

    if (!tabWalletWindow) {
      throw new StandardCoongError('Error open wallet tab');
    }

    await this.waitUntilWalletReady();

    this.walletWindow = tabWalletWindow;

    return tabWalletWindow;
  }

  protected onSignal(signal: WalletSignal) {
    if (signal === WalletSignal.WALLET_TAB_INITIALIZED) {
      this.ready = true;
    } else if (signal === WalletSignal.WALLET_TAB_UNLOADED) {
      this.ready = false;
    }
  }
}
