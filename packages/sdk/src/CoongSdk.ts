import { MessageType, WalletRequestMessage } from '@coong/base/types';
import { assert, assertFalse, CoongError, ErrorCode } from '@coong/utils';
import { injectWalletAPI, setupWalletMessageHandler } from './message';
import EmbedInstance from './wallet/EmbedInstance';
import TabInstance from './wallet/TabInstance';

const DEFAULT_WALLET_URL = 'https://app.coongwallet.io';

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

    injectWalletAPI(this.#embedInstance);

    this.#initialized = true;

    console.log('Coong SDK initialized!');
  }

  destroy() {
    // TODO clean up
  }

  async openWalletWindow(path = ''): Promise<Window> {
    return new TabInstance(this.#walletUrl).openWalletWindow(path);
  }

  async sendMessageToEmbedInstance(message: WalletRequestMessage) {
    this.ensureSdkInitialized();

    this.#embedInstance!.walletWindow!.postMessage(message, this.#walletUrl || '*');
  }

  async sendMessageToTabInstance(message: WalletRequestMessage) {
    this.ensureSdkInitialized();

    const params = new URLSearchParams({
      message: JSON.stringify(message),
    });

    await this.openWalletWindow(`/request?${params.toString()}`);
  }

  async sendMessageToWallet(message: WalletRequestMessage) {
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
