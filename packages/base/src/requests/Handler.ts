import WalletState from './WalletState';

export default abstract class Handler {
  readonly #state: WalletState;

  constructor(state: WalletState) {
    this.#state = state;
  }

  get state() {
    return this.#state;
  }
}
