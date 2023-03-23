import { compareWalletInfo } from '@coong/base';
import { WalletSignal, WalletSignalMessage } from '@coong/base/types';
import { StandardCoongError } from '@coong/utils';
import WalletInstance from './WalletInstance';

/**
 * @name TabInstance
 * @description Represent a tab instance of the wallet loaded inside a browser tab or popup,
 * we can interact with the instance after calling `openWalletWindow` via the `walletWindow` object
 */
export default class TabInstance extends WalletInstance {
  async openWalletWindow(path = ''): Promise<Window> {
    this.registerEvent();

    const tabWalletWindow = window.open(`${this.walletUrl}${path}`, '_blank');

    if (!tabWalletWindow) {
      // TODO show a popup asking users to allow popup
      //      with instructions to enable that
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
