import { MessageType, WalletRequestEvent } from '@coong/base/types';
import { assert, assertFalse, CoongError, ErrorCode } from '@coong/utils';
import { injectWalletAPI, setupWalletMessageHandler } from 'message';
import EmbedInstance from 'wallet/EmbedInstance';
import TabInstance from 'wallet/TabInstance';

const DEFAULT_WALLET_URL = 'https://coongwallet.io';

export default class CoongSdk {
  static #instance: CoongSdk;
  #embedInstance?: EmbedInstance;
  #walletUrl: string;
  #initialized: boolean;

  private constructor() {
    this.#initialized = false;
    this.#walletUrl = DEFAULT_WALLET_URL;
  }

  static instance() {
    if (!this.#instance) {
      this.#instance = new CoongSdk();
    }

    return this.#instance;
  }

  async initialize(walletUrl?: string) {
    assert(typeof window !== 'undefined', 'Coong SDK only works in browser environment!');
    assertFalse(this.#initialized, 'Coong Sdk is already initialized!');

    // TODO validate url format
    if (walletUrl) {
      this.#walletUrl = walletUrl;
    }

    this.#embedInstance = new EmbedInstance(this.#walletUrl);
    await this.#embedInstance!.initialize();

    setupWalletMessageHandler(this.#walletUrl);

    injectWalletAPI();

    this.#initialized = true;

    console.log('Coong SDK initialized!');
  }

  destroy() {
    // TODO clean up
  }

  async openWalletWindow(path = ''): Promise<Window> {
    return new TabInstance(this.#walletUrl).openWalletWindow(path);
  }

  async sendMessageToEmbedInstance(message: WalletRequestEvent) {
    this.ensureSdkInitialized();

    this.#embedInstance!.walletWindow!.postMessage(message, this.#walletUrl || '*');
  }

  async sendMessageToTabInstance(message: WalletRequestEvent) {
    this.ensureSdkInitialized();

    const params = new URLSearchParams({
      message: JSON.stringify({ origin: window.location.origin, data: message }),
    });

    await this.openWalletWindow(`/request?${params.toString()}`);
  }

  async sendMessageToWallet(message: WalletRequestEvent) {
    const { type, request } = message;
    assert(type === MessageType.REQUEST && request, 'Invalid message format');

    const { name } = request;

    if (name.startsWith('tab/')) {
      await this.sendMessageToTabInstance(message);
    } else if (name.startsWith('embed/')) {
      await this.sendMessageToEmbedInstance(message);
    } else {
      throw new CoongError(ErrorCode.InvalidMessageFormat);
    }
  }

  ensureSdkInitialized() {
    assert(this.#initialized, 'CoongSdk has not been initialized!');
  }

  get initialized() {
    return this.#initialized;
  }
}
