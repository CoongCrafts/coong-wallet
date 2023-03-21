import { MessageType, WalletRequestMessage } from '@coong/base/types';
import { assert, assertFalse, CoongError, ErrorCode } from '@coong/utils';
import { injectWalletAPI, setupWalletMessageHandler } from './message';
import EmbedInstance from './wallet/EmbedInstance';
import TabInstance from './wallet/TabInstance';

const DEFAULT_WALLET_URL = 'https://app.coongwallet.io';

/**
 * @name CoongSdk
 * @description A helper to initialize/inject Coong Wallet API
 * and interact with wallet instances (tab/embed)
 *
 * ## Initialize & interact with Coong Wallet
 *
 * ```javascript
 * import CoongSdk from '@coong/sdk';
 *
 *
 * const initializeCoongWallet = async () => {
 *   // Inject Coong Wallet API
 *   await CoongSdk.instance().initialize();
 *
 *   // We can now interact with the wallet using the similar Polkadot{.js} extension API
 *   const coongInjected = await window['injectedWeb3']['coongwallet'].enable('Awesome Dapp');
 *   const approvedAccounts = await coongInjected.accounts.get();
 * }
 *
 * initializeCoongWallet();
 * ```
 */
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

  /**
   * Initialize & inject wallet API
   *
   * @param walletUrl customize wallet url, by default the SDK will connect to the official url defined at `DEFAULT_WALLET_URL`
   */
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

  /**
   * Send a message to wallet instance (embed or tab) based on the request name
   *
   * @param message
   */
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

  /**
   * Making sure the wallet has been initialized, else an error will be thrown out
   */
  ensureSdkInitialized() {
    assert(this.#initialized, 'CoongSdk has not been initialized!');
  }

  get initialized() {
    return this.#initialized;
  }
}
