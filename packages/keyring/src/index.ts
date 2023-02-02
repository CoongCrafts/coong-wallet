import { KeyringPair } from '@polkadot/keyring/types';
import { Keyring as InnerKeyring } from '@polkadot/ui-keyring';
import { AccountInfo } from '@coong/keyring/types';
import { assert, CoongError, ErrorCode } from '@coong/utils';
import CryptoJS from 'crypto-js';

const ENCRYPTED_MNEMONIC = 'ENCRYPTED_MNEMONIC';
const ACCOUNTS_INDEX = 'ACCOUNTS_INDEX';
const UNLOCK_UNTIL = 'UNLOCK_UNTIL';
const DEFAULT_KEY_TYPE = 'sr25519';
const UNLOCK_INTERVAL = 15 * 60 * 1000;

export default class Keyring {
  #keyring: InnerKeyring;
  #mnemonic: string | null;

  constructor() {
    this.#mnemonic = null;

    this.#keyring = new InnerKeyring();
    this.#keyring.loadAll({});
  }

  async initialize(mnemonic: string, password: string) {
    const encryptedSeed = CryptoJS.AES.encrypt(mnemonic, password).toString();
    localStorage.setItem(ENCRYPTED_MNEMONIC, encryptedSeed);
  }

  async initialized(): Promise<boolean> {
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

  async reset() {
    const accounts = await this.getAccounts();
    accounts.forEach((account) => {
      this.#keyring.forgetAccount(account.address);
    });
    localStorage.removeItem(ENCRYPTED_MNEMONIC);
    localStorage.removeItem(ACCOUNTS_INDEX);
    localStorage.removeItem(UNLOCK_UNTIL);
  }

  async unlock(password: string): Promise<void> {
    if (!(await this.initialized())) {
      throw new CoongError(ErrorCode.KeyringNotInitialized);
    }

    if (!this.locked()) {
      return;
    }

    try {
      const decrypted = CryptoJS.AES.decrypt(this.#getEncryptedMnemonic()!, password);
      const raw = decrypted.toString(CryptoJS.enc.Utf8);
      assert(raw);

      this.#mnemonic = raw;
      localStorage.setItem(UNLOCK_UNTIL, String(Date.now() + UNLOCK_INTERVAL));

      setTimeout(() => {
        this.#mnemonic = null;
      }, UNLOCK_INTERVAL); // TODO: change this auto-lock timmer
    } catch (e: any) {
      throw new CoongError(ErrorCode.PasswordIncorrect);
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

  async getAccounts(): Promise<AccountInfo[]> {
    return Object.values(this.accountsStore.subject.getValue()).map(({ json: { address, meta }, type }) => ({
      address,
      ...meta,
      type,
    }));
  }

  async createNewAccount(name: string): Promise<KeyringPair> {
    if (this.locked()) {
      throw new CoongError(ErrorCode.WalletLocked);
    }

    if (!name) {
      throw new CoongError(ErrorCode.AccountNameRequired);
    }

    // TODO check if name is already used

    const nextPath = `${this.#mnemonic}${this.#nextAccountPath()}`;
    const keypair = this.#keyring.createFromUri(nextPath, { name }, DEFAULT_KEY_TYPE);

    // TODO: encrypt data
    this.#keyring.saveAccount(keypair);
    this.#increaseAccountsIndex();

    return keypair;
  }

  get accountsStore() {
    return this.#keyring.accounts;
  }
}
