import { isWalletSignal } from '@coong/base';
import { WalletSignal, WalletSignalMessage } from '@coong/base/types';
import { StandardCoongError } from '@coong/utils';

export default abstract class WalletInstance {
  public readonly walletUrl: string;
  public ready: boolean;
  public walletWindow?: Window;

  constructor(_walletUrl: string) {
    this.ready = false;
    this.walletUrl = _walletUrl;
  }

  protected waitUntilWalletReady(): Promise<void> {
    return new Promise((resolve) => {
      const waitInterval = setInterval(() => {
        if (this.ready) {
          clearInterval(waitInterval);
          resolve();
        }
      }, 10);
    });
  }

  protected registerEvent() {
    const onMessage = (event: MessageEvent<WalletSignalMessage>) => {
      const { origin, data } = event;
      if (origin !== this.walletUrl) {
        return;
      }

      if (!isWalletSignal(data)) {
        return;
      }

      const { signal } = data;

      this.onSignal(signal as WalletSignal);
    };

    // TODO clean up message event on closing the wallet
    window.addEventListener('message', onMessage);
  }

  protected onSignal(signal: WalletSignal) {
    throw new StandardCoongError('Implement this method');
  }
}
