import WalletState from 'requests/WalletState';

export default abstract class Handler {
  readonly #state: WalletState;

  constructor(state: WalletState) {
    this.#state = state;
  }

  protected get state() {
    return this.#state;
  }
}
