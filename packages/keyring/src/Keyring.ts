import { KeyringPair } from '@polkadot/keyring/types';
import { Keyring as InnerKeyring } from '@polkadot/ui-keyring/Keyring';
import { u8aToHex } from '@polkadot/util';
import { sha256AsU8a } from '@polkadot/util-crypto';
import { validateMnemonic } from '@polkadot/util-crypto/mnemonic/bip39';
import { assert, CoongError, ErrorCode, isCoongError, StandardCoongError } from '@coong/utils';
import CryptoJS from 'crypto-js';
import { AccountBackup, AccountInfo, WalletBackup, WalletQrBackup } from './types';

export const ENCRYPTED_MNEMONIC = 'ENCRYPTED_MNEMONIC';
export const ORIGINAL_HASH = 'ORIGINAL_HASH';
export const ACCOUNTS_INDEX = 'ACCOUNTS_INDEX';
export const DEFAULT_KEY_TYPE = 'sr25519';

const DERIVATION_PATH_PREFIX = '//';

const sha256AsHex = (data: string): string => {
  return u8aToHex(sha256AsU8a(data));
};

export default class Keyring {
  #keyring!: InnerKeyring;
  #mnemonic: string | null;

  constructor() {
    this.#mnemonic = null;

    this.reload();
  }

  reload() {
    try {
      this.#keyring = new InnerKeyring();
      this.#keyring.loadAll({});
    } catch (e: any) {
      if (e.message === 'Unable to initialise options more than once') {
        // TODO Better handle this issue, ignore this for now
        return;
      }

      throw e;
    }
  }

  async initialize(mnemonic: string, password: string) {
    const encryptedSeed = CryptoJS.AES.encrypt(mnemonic, password).toString();
    localStorage.setItem(ORIGINAL_HASH, sha256AsHex(mnemonic));
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
    return !this.#mnemonic;
  }

  lock() {
    this.#mnemonic = null;
  }

  async reset() {
    const accounts = await this.getAccounts();
    // TODO improve this process to clear all at once!
    accounts.forEach((account) => {
      this.#keyring.forgetAccount(account.address);
    });
    localStorage.removeItem(ENCRYPTED_MNEMONIC);
    localStorage.removeItem(ORIGINAL_HASH);
    localStorage.removeItem(ACCOUNTS_INDEX);
  }

  async unlock(password: string): Promise<void> {
    await this.ensureWalletInitialized();

    if (!this.locked()) {
      return;
    }

    this.#mnemonic = await this.#decryptMnemonic(password);
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

  async getRawMnemonic(password: string): Promise<string> {
    return await this.#decryptMnemonic(password);
  }

  async verifyPassword(password: string) {
    await this.#decryptMnemonic(password);
  }

  #getOriginalHash(): string | null {
    return localStorage.getItem(ORIGINAL_HASH);
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
    return Object.values(this.accountsStore.subject.getValue())
      .map(({ json: { address, meta }, type }) => ({
        address,
        ...meta,
        type,
      }))
      .sort((a, b) => (a.whenCreated || 0) - (b.whenCreated || 0));
  }

  async createNewAccount(name: string, password: string, path?: string): Promise<AccountInfo> {
    if (password) {
      await this.unlock(password);
    } else {
      throw new CoongError(ErrorCode.PasswordRequired);
    }

    if (!name) {
      throw new CoongError(ErrorCode.AccountNameRequired);
    }

    if (await this.existsName(name)) {
      throw new CoongError(ErrorCode.AccountNameUsed);
    }

    let derivationPath = path ?? this.#nextAccountPath();
    if (!!derivationPath && !derivationPath.startsWith(DERIVATION_PATH_PREFIX)) {
      derivationPath = DERIVATION_PATH_PREFIX + derivationPath;
    }

    const nextPath = `${this.#mnemonic}${derivationPath}`;
    const keypair = this.#keyring.createFromUri(nextPath, { name, derivationPath }, DEFAULT_KEY_TYPE);

    this.#keyring.saveAccount(keypair, password);

    const shouldIncreaseIndex = typeof path !== 'string';
    if (shouldIncreaseIndex) {
      this.#increaseAccountsIndex();
    }

    this.lock();

    return this.getAccount(keypair.address);
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

  async changePassword(currentPassword: string, newPassword: string) {
    const rawMnemonic = await this.getRawMnemonic(currentPassword);

    // initialize wallet with new password
    await this.initialize(rawMnemonic, newPassword);

    const accounts = await this.getAccounts();

    accounts.forEach(({ address }) => {
      const account = this.getSigningPair(address);
      account.decodePkcs8(currentPassword);
      this.#keyring.saveAccount(account, newPassword);
      account.lock();
    });
  }

  async removeAccount(address: string) {
    await this.#keyring.forgetAccount(address);
  }

  async renameAccount(address: string, newName: string) {
    if (await this.existsName(newName)) {
      throw new CoongError(ErrorCode.AccountNameUsed);
    }

    const account = await this.getSigningPair(address);
    this.#keyring.saveAccountMeta(account, { ...account.meta, name: newName });
  }

  async #getAccount(predicate: (one: AccountInfo) => boolean): Promise<AccountInfo> {
    const accounts = await this.getAccounts();
    const targetAccount = accounts.find(predicate);

    if (!targetAccount) {
      throw new CoongError(ErrorCode.AccountNotFound);
    }

    return targetAccount;
  }

  async getAccount(address: string) {
    try {
      const pair = this.getSigningPair(address);

      return this.#getAccount((one) => one.address === pair.address);
    } catch (e: any) {
      if (isCoongError(e)) {
        throw new CoongError(ErrorCode.AccountNotFound);
      }

      throw e;
    }
  }

  async getAccountByName(name: string) {
    return this.#getAccount((one) => one.name === name);
  }

  async existsName(name: string): Promise<boolean> {
    try {
      return !!(await this.getAccountByName(name));
    } catch (e: any) {
      if (isCoongError(e) && e.code === ErrorCode.AccountNotFound) {
        return false;
      }

      throw e;
    }
  }

  async exportAccount(address: string, password: string): Promise<AccountBackup> {
    await this.verifyPassword(password);

    const account = this.getSigningPair(address);
    const accountBackup = this.#keyring.backupAccount(account, password);

    if (accountBackup.meta.isExternal) {
      delete accountBackup.meta.isExternal;
      return accountBackup;
    }

    let originalHash = this.#getOriginalHash();

    if (!originalHash) {
      const rawMnemonic = await this.#decryptMnemonic(password);
      originalHash = sha256AsHex(rawMnemonic);
      localStorage.setItem(ORIGINAL_HASH, originalHash);
    }

    Object.assign(accountBackup.meta, { originalHash });

    return accountBackup;
  }

  async exportWallet(password: string): Promise<WalletBackup> {
    await this.verifyPassword(password);

    const addresses = (await this.getAccounts()).map((one) => one.address);
    const accountsBackup = await this.#keyring.backupAccounts(addresses, password);

    const walletBackup: WalletBackup = {
      ...accountsBackup,
      accountsIndex: this.getAccountsIndex(),
      encryptedMnemonic: this.#getEncryptedMnemonic()!,
    };

    return walletBackup;
  }

  async importQrBackup(backup: WalletQrBackup, password: string) {
    if (await this.initialized()) {
      throw new StandardCoongError('Wallet is already initialized');
    }

    try {
      const { encryptedMnemonic, accountsIndex, accounts } = backup;
      localStorage.setItem(ACCOUNTS_INDEX, accountsIndex.toString());
      localStorage.setItem(ENCRYPTED_MNEMONIC, encryptedMnemonic);

      const rawMnemonic = await this.#decryptMnemonic(password);
      if (!validateMnemonic(rawMnemonic)) {
        throw new CoongError(ErrorCode.InvalidMnemonic);
      }

      localStorage.setItem(ORIGINAL_HASH, sha256AsHex(rawMnemonic));

      for (let account of accounts) {
        const [path, name] = account;
        await this.createNewAccount(name, password, path);
      }
    } catch (e: any) {
      await this.reset();

      if (e instanceof StandardCoongError) {
        throw e;
      } else {
        throw new StandardCoongError(e.message);
      }
    }
  }
}
