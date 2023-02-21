import { compareWalletInfo } from '@coong/base';
import { WalletSignal, WalletSignalMessage } from '@coong/base/types';
import WalletInstance from 'wallet/WalletInstance';

export default class EmbedInstance extends WalletInstance {
  async initialize() {
    this.registerEvent();

    this.walletWindow = await this.#injectWalletIframe();
  }

  async #injectWalletIframe(): Promise<Window> {
    // TODO check iframe duplication

    const iframe = document.createElement('iframe');
    iframe.src = `${this.walletUrl}/embed`;
    iframe.id = 'coong-wallet-embed';
    iframe.style.display = 'none';

    document.body.append(iframe);

    await this.waitUntilWalletReady();

    return iframe.contentWindow!;
  }

  protected onSignal({ signal, walletInfo }: WalletSignalMessage) {
    if (signal === WalletSignal.WALLET_EMBED_INITIALIZED) {
      this.ready = true;
      this.walletInfo = walletInfo;
    } else if (signal === WalletSignal.WALLET_EMBED_UNLOADED && compareWalletInfo(this.walletInfo, walletInfo)) {
      this.ready = false;
    }
  }
}
