import CryptoJS from 'crypto-js';
import { Keyring as PKeyring } from '@polkadot/ui-keyring';
import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { KeyringPair } from '@polkadot/keyring/types';

const ENCRYPTED_MNEMONIC = 'ENCRYPTED_MNEMONIC';
const ACCOUNTS_INDEX = 'ACCOUNTS_INDEX';
const UNLOCK_UNTIL = 'UNLOCK_UNTIL';
const DEFAULT_KEY_TYPE = 'sr25519';
const UNLOCK_INTERVAL = 15 * 60 * 1000;

export default class Keyring {
  #keyring: PKeyring;
  #mnemonic: string | null;

  constructor() {
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
    const unlockTimer = this.#getUnlockTimer();
    if (!unlockTimer) {
      return true;
    }

    return unlockTimer < Date.now();
  }

  lock() {
    localStorage.setItem(UNLOCK_UNTIL, String(Date.now() - 1000));
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
      const raw = decrypted.toString(CryptoJS.enc.Utf8);
      if (!raw) {
        throw new Error();
      }

      this.#mnemonic = raw;
      localStorage.setItem(UNLOCK_UNTIL, String(Date.now() + UNLOCK_INTERVAL));

      setTimeout(() => {
        this.#mnemonic = null;
      }, UNLOCK_INTERVAL); // TODO: change this auto-lock timmer
    } catch (e: any) {
      throw new Error('Password is incorrect');
    }
  }

  #getEncryptedMnemonic(): string | null {
    return localStorage.getItem(ENCRYPTED_MNEMONIC);
  }

  getAccountsIndex(): number {
    return parseInt(localStorage.getItem(ACCOUNTS_INDEX)!) || 0;
  }

  #getUnlockTimer(): number | null {
    return parseInt(localStorage.getItem(UNLOCK_UNTIL)!) || null;
  }

  #increaseAccountsIndex(): number {
    const next = this.getAccountsIndex() + 1;
    localStorage.setItem(ACCOUNTS_INDEX, next.toString());
    return next;
  }

  #nextAccountPath(): string {
    const currentIndex = this.getAccountsIndex();
    if (currentIndex === 0) {
      return '';
    }

    return `//${currentIndex - 1}`;
  }

  async getAccounts(): Promise<KeyringAddress[]> {
    return this.#keyring.getAccounts().sort((a, b) => (a.meta.whenCreated || 0) - (b.meta.whenCreated || 0));
  }

  async createNewAccount(name: string): Promise<KeyringPair> {
    if (this.locked()) {
      throw new Error('Unlock the wallet first!');
    }

    if (!name) {
      throw new Error('Account name is required');
    }

    // TODO check if name is already used

    const nextPath = `${this.#mnemonic}${this.#nextAccountPath()}`;
    const keypair = this.#keyring.createFromUri(nextPath, { name }, DEFAULT_KEY_TYPE);

    // TODO: encrypt data
    this.#keyring.saveAccount(keypair);
    this.#increaseAccountsIndex();

    return keypair;
  }
}
