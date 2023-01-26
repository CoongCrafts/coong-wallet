import State from '@coong/base/requests/State';

export default abstract class Handler {
  readonly #state: State;

  constructor(state: State) {
    this.#state = state;
  }

  protected get state() {
    return this.#state;
  }
}
