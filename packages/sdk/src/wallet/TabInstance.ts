import { compareWalletInfo } from '@coong/base';
import { WalletSignal, WalletSignalMessage } from '@coong/base/types';
import { StandardCoongError } from '@coong/utils';
import WalletInstance from './WalletInstance';

const POPUP_WINDOW_FEATURES = `resizable=no,status=no,location=no,toolbar=no,menubar=no,width=620,height=700,left=150,top=150`;

/**
 * @name TabInstance
 * @description Represent a tab instance of the wallet loaded inside a browser tab or popup,
 * we can interact with the instance after calling `openWalletWindow` via the `walletWindow` object
 */
export default class TabInstance extends WalletInstance {
  async openWalletWindow(path = ''): Promise<void> {
    this.registerEvent();

    const tabWalletWindow = window.open(`${this.walletUrl}${path}`, '_blank', POPUP_WINDOW_FEATURES);

    if (!tabWalletWindow) {
      const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      // TODO show a popup asking users to allow popup
      //      with instructions to enable that
      if (isFirefox) {
        console.log('// TODO: Show dialog to instruct users to allow popup!');
      } else {
        throw new StandardCoongError('Error open wallet tab');
      }
    }

    await this.waitUntilWalletReady();
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
