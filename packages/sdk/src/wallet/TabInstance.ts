import { compareWalletInfo } from '@coong/base';
import { WalletSignal, WalletSignalMessage } from '@coong/base/types';
import { StandardCoongError } from '@coong/utils';
import WalletInstance from 'wallet/WalletInstance';

export default class TabInstance extends WalletInstance {
  async openWalletWindow(path = ''): Promise<Window> {
    this.registerEvent();

    const tabWalletWindow = window.open(`${this.walletUrl}${path}`, '_blank');

    if (!tabWalletWindow) {
      throw new StandardCoongError('Error open wallet tab');
    }

    await this.waitUntilWalletReady();

    this.walletWindow = tabWalletWindow;

    return tabWalletWindow;
  }

  protected onSignal({ signal, walletInfo }: WalletSignalMessage) {
    if (signal === WalletSignal.WALLET_TAB_INITIALIZED) {
      this.ready = true;
      this.walletInfo = walletInfo;
    } else if (signal === WalletSignal.WALLET_TAB_UNLOADED && compareWalletInfo(this.walletInfo, walletInfo)) {
      this.ready = false;
    }
  }
}
