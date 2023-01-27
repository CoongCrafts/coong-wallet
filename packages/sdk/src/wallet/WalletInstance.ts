import { MessageType, WalletSignal, WalletSignalEvent } from '@coong/base/types';
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
    const onMessage = (event: MessageEvent<WalletSignalEvent>) => {
      const { origin, data } = event;
      if (origin !== this.walletUrl) {
        return;
      }

      const { type, signal } = data;

      if (type !== MessageType.SIGNAL) {
        return;
      }

      this.onSignal(signal as WalletSignal);
    };

    // TODO clean up message event on closing the wallet
    window.addEventListener('message', onMessage);
  }

  protected onSignal(signal: WalletSignal) {
    throw new StandardCoongError('Implement this method');
  }
}
