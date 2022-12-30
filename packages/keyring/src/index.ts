import CryptoJS from 'crypto-js';
import { Keyring as PKeyring } from '@polkadot/ui-keyring';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { KeyringPair } from '@polkadot/keyring/types';

const ENCRYPTED_MNEMONIC = 'ENCRYPTED_MNEMONIC';
const ACCOUNTS_INDEX = 'ACCOUNTS_INDEX';
const DEFAULT_KEY_TYPE = 'sr25519';

export default class Keyring {
  #keyring: PKeyring;
  #index: number = 0;
  #isLocked: boolean;
  #mnemonic: string | null;

  constructor() {
    this.#isLocked = true;
    this.#mnemonic = null;

    this.#keyring = new PKeyring();
    this.#keyring.loadAll({});
  }

  async init(mnemonic: string, password: string) {
    const encryptedSeed = CryptoJS.AES.encrypt(mnemonic, password).toString();
    localStorage.setItem(ENCRYPTED_MNEMONIC, encryptedSeed);
  }

  async isInitialized(): Promise<boolean> {
    return !!this.#getEncryptedMnemonic();
  }

  locked() {
    return this.#isLocked;
  }

  async unlock(password: string): Promise<void> {
    if (!(await this.isInitialized())) {
      throw new Error('Keyring is not initialized!');
    }

    if (!this.locked()) {
      return;
    }

    try {
      const decrypted = CryptoJS.AES.decrypt(this.#getEncryptedMnemonic()!, password);
      this.#mnemonic = decrypted.toString(CryptoJS.enc.Utf8);
      this.#isLocked = false;

      setTimeout(() => {
        this.#mnemonic = null;
        this.#isLocked = true;
      }, 10_000); // TODO: change this auto-lock timmer
    } catch (e: any) {
      throw new Error('Password is incorrect');
    }
  }

  #getEncryptedMnemonic(): string | null {
    return localStorage.getItem(ENCRYPTED_MNEMONIC);
  }

  #getAccountsIndex(): number {
    return parseInt(localStorage.getItem(ACCOUNTS_INDEX) || '0') || 0;
  }

  #increaseAccountsIndex(): number {
    const next = this.#getAccountsIndex() + 1;
    localStorage.setItem(ACCOUNTS_INDEX, next.toString());
    return next;
  }

  #nextAccountPath(): string {
    const currentIndex = this.#getAccountsIndex();
    if (currentIndex === 0) {
      return '';
    }

    return `//${currentIndex - 1}`;
  }

  async getAccounts(): Promise<KeyringAddress[]> {
    return this.#keyring.getAccounts();
  }

  async createNewAccount(name: string): Promise<KeyringPair> {
    if (this.locked()) {
      throw new Error('Unlock the wallet first!');
    }

    const nextPath = `${this.#mnemonic}${this.#nextAccountPath()}`;
    const keypair = this.#keyring.createFromUri(nextPath, { name }, DEFAULT_KEY_TYPE);

    // TODO: encrypt data
    this.#keyring.saveAccount(keypair);
    this.#increaseAccountsIndex();

    return keypair;
  }
}
