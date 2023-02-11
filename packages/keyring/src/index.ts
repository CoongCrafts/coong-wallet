import { KeyringPair } from '@polkadot/keyring/types';
import { Keyring as InnerKeyring } from '@polkadot/ui-keyring';
import { AccountInfo } from '@coong/keyring/types';
import { assert, CoongError, ErrorCode } from '@coong/utils';
import CryptoJS from 'crypto-js';

const ENCRYPTED_MNEMONIC = 'ENCRYPTED_MNEMONIC';
const ACCOUNTS_INDEX = 'ACCOUNTS_INDEX';
const DEFAULT_KEY_TYPE = 'sr25519';
const UNLOCK_INTERVAL = 15 * 60 * 1000; // 15 minutes

export default class Keyring {
  #keyring: InnerKeyring;
  #mnemonic: string | null;
  #unlockUntil: number | null;

  constructor() {
    this.#mnemonic = null;
    this.#unlockUntil = null;

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

  async ensureWalletInitialized() {
    if (!(await this.initialized())) {
      throw new CoongError(ErrorCode.KeyringNotInitialized);
    }
  }

  locked() {
    if (!this.#unlockUntil || !this.#mnemonic) {
      return true;
    }

    return this.#unlockUntil < Date.now();
  }

  lock() {
    this.#unlockUntil = null;
  }

  async reset() {
    const accounts = await this.getAccounts();
    accounts.forEach((account) => {
      this.#keyring.forgetAccount(account.address);
    });
    localStorage.removeItem(ENCRYPTED_MNEMONIC);
    localStorage.removeItem(ACCOUNTS_INDEX);
  }

  async unlock(password: string): Promise<void> {
    await this.ensureWalletInitialized();

    if (!this.locked()) {
      return;
    }

    this.#mnemonic = await this.#decryptMnemonic(password);
    this.#unlockUntil = Date.now() + UNLOCK_INTERVAL;

    setTimeout(() => {
      this.#mnemonic = null;
      this.#unlockUntil = null;
    }, UNLOCK_INTERVAL); // TODO: change this auto-lock timmer
  }

  async #decryptMnemonic(password: string): Promise<string> {
    await this.ensureWalletInitialized();

    try {
      const decrypted = CryptoJS.AES.decrypt(this.#getEncryptedMnemonic()!, password);
      const raw = decrypted.toString(CryptoJS.enc.Utf8);
      assert(raw);

      return raw;
    } catch (e: any) {
      throw new CoongError(ErrorCode.PasswordIncorrect);
    }
  }

  async verifyPassword(password: string) {
    await this.ensureWalletInitialized();
    await this.#decryptMnemonic(password);
  }

  #getEncryptedMnemonic(): string | null {
    return localStorage.getItem(ENCRYPTED_MNEMONIC);
  }

  getAccountsIndex(): number {
    return parseInt(localStorage.getItem(ACCOUNTS_INDEX)!) || 0;
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

    const existingAccount = await this.getAccountByName(name);
    if (existingAccount) {
      throw new CoongError(ErrorCode.AccountNameUsed);
    }

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

  getSigningPair(address: string): KeyringPair {
    try {
      return this.#keyring.getPair(address);
    } catch (e: any) {
      throw new CoongError(ErrorCode.KeypairNotFound);
    }
  }

  getAccount(address: string) {
    const pair = this.getSigningPair(address);

    return { address, ...pair.meta };
  }

  async getAccountByName(name: string) {
    return (await this.getAccounts()).find((one) => one.name === name);
  }
}
