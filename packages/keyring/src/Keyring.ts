import { KeyringPair, KeyringPair$Meta } from '@polkadot/keyring/types';
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

export const sha256AsHex = (data: string): string => {
  return u8aToHex(sha256AsU8a(data));
};

/**
 * @name Keyring
 * @description Keyring management for user accounts
 *
 * Coong Wallet is a hierarchical deterministic (HD) wallet following the idea of BIP-32,
 * which only requires users to back up only one seed phrase upon setting up the wallet.
 *
 * New accounts will be created by deriving from a mnemonic and an accountsIndex number
 * as the derivation path (//{index}), index number will be started from 0
 * and increased one by one as new accounts are created.
 *
 * The first account will be created without derivation path,
 * this is to be compatible with the Polkadot{.js} wallet.
 */
export default class Keyring {
  #keyring!: InnerKeyring;
  #mnemonic: string | null;

  constructor() {
    this.#mnemonic = null;

    this.reload();
  }

  /**
   * Reload accounts from storage
   */
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

  /**
   * Initialize the keyring with a mnemonic and wallet password
   * Private keys & mnemonic will be encrypted using wallet password
   *
   * @param mnemonic
   * @param password
   */
  async initialize(mnemonic: string, password: string) {
    const encryptedSeed = CryptoJS.AES.encrypt(mnemonic, password).toString();
    localStorage.setItem(ENCRYPTED_MNEMONIC, encryptedSeed);
    this.#generateOriginalHash(mnemonic);
  }

  /**
   * Check if the keyring is initialized
   */
  async initialized(): Promise<boolean> {
    return !!this.#getEncryptedMnemonic();
  }

  async ensureWalletInitialized() {
    if (!(await this.initialized())) {
      throw new CoongError(ErrorCode.KeyringNotInitialized);
    }
  }

  /**
   * Check if the keyring is locked or not
   */
  locked() {
    return !this.#mnemonic;
  }

  /**
   * Lock the keyring
   */
  lock() {
    this.#mnemonic = null;
  }

  /**
   * Reset the keyring, clear all persistent data, remove all user accounts
   */
  async reset() {
    localStorage.removeItem(ENCRYPTED_MNEMONIC);
    localStorage.removeItem(ORIGINAL_HASH);
    localStorage.removeItem(ACCOUNTS_INDEX);

    const accounts = await this.getAccounts();
    // TODO improve this process to clear all at once!
    accounts.forEach((account) => {
      this.#keyring.forgetAccount(account.address);
    });
  }

  /**
   * Unlock the keyring with wallet password
   *
   * @param password
   */
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

  /**
   * Decrypt & return the mnemonic with wallet password
   *
   * @param password
   */
  async getRawMnemonic(password: string): Promise<string> {
    return await this.#decryptMnemonic(password);
  }

  /**
   * Verify if wallet password is correct
   * @param password
   */
  async verifyPassword(password: string) {
    await this.#decryptMnemonic(password);
  }

  #getOriginalHash(): string | null {
    return localStorage.getItem(ORIGINAL_HASH);
  }

  #ensureOriginalHash(): string {
    const originalHash = this.#getOriginalHash();

    assert(originalHash, ErrorCode.OriginalHashNotFound);

    return originalHash!;
  }

  #generateOriginalHash(rawMnemonic: string): string {
    const originalHash = sha256AsHex(rawMnemonic);
    localStorage.setItem(ORIGINAL_HASH, originalHash);

    return originalHash;
  }

  /**
   * Check the make sure originalHash presence,
   * if not generate a new one with wallet password
   *
   * @param password
   */
  async ensureOriginalHashPresence(password: string) {
    if (!this.#getOriginalHash()) {
      const rawMnemonic = await this.getRawMnemonic(password);
      this.#generateOriginalHash(rawMnemonic);
    }
  }

  #getEncryptedMnemonic(): string | null {
    return localStorage.getItem(ENCRYPTED_MNEMONIC);
  }

  /**
   * Get current accounts index
   */
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

  /**
   * Get list of accounts in keyring
   */
  async getAccounts(): Promise<AccountInfo[]> {
    return Object.values(this.accountsStore.subject.getValue())
      .map(({ json: { address, meta }, type }) => ({
        address,
        ...meta,
        type,
      }))
      .sort((a, b) => (a.whenCreated || 0) - (b.whenCreated || 0));
  }

  /**
   * Create new account
   *
   * @param name
   * @param password
   * @param path
   */
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

  /**
   * Get signing pair for a specific address
   *
   * @param address
   */
  getSigningPair(address: string): KeyringPair {
    try {
      return this.#keyring.getPair(address);
    } catch (e: any) {
      throw new CoongError(ErrorCode.KeypairNotFound);
    }
  }

  /**
   * Change wallet password
   *
   * @param currentPassword
   * @param newPassword
   */
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

  /**
   * Remove an account
   *
   * @param address
   */
  async removeAccount(address: string) {
    await this.#keyring.forgetAccount(address);
  }

  /**
   * Rename an account
   *
   * @param address
   * @param newName
   */
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

  /**
   * Get an account
   *
   * @param address
   */
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

  async existsAccount(address: string) {
    try {
      return !!(await this.getAccount(address));
    } catch (e: any) {
      if (isCoongError(e) && e.code === ErrorCode.AccountNotFound) {
        return false;
      }

      throw e;
    }
  }

  /**
   * Get an account by name
   *
   * @param name
   */
  async getAccountByName(name: string) {
    return this.#getAccount((one) => one.name === name);
  }

  /**
   * Check if an account is existed by name
   *
   * @param name
   */
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

  /**
   * Export an account
   *
   * @param address
   * @param password
   */
  async exportAccount(address: string, password: string): Promise<AccountBackup> {
    await this.verifyPassword(password);

    const account = this.getSigningPair(address);
    const accountBackup = this.#keyring.backupAccount(account, password);

    if (accountBackup.meta.isExternal) {
      delete accountBackup.meta.isExternal;
      return accountBackup;
    }

    const originalHash = this.#ensureOriginalHash();
    Object.assign(accountBackup.meta, { originalHash });

    return accountBackup;
  }

  /**
   * Check if an account is external by verify original hash
   *
   * @param accountOriginalHash
   */
  isExternalAccount(accountOriginalHash: string | undefined) {
    return accountOriginalHash !== this.#ensureOriginalHash();
  }

  /**
   * Import an account from a backup and a password for that backup
   *
   * @param backup
   * @param password
   */
  async importAccount(backup: AccountBackup, password: string) {
    const { address, meta } = backup;

    if (await this.existsAccount(address)) {
      throw new CoongError(ErrorCode.AccountExisted);
    }

    if (!meta.name) {
      throw new CoongError(ErrorCode.AccountNameRequired);
    } else if (await this.existsName(meta.name as string)) {
      throw new CoongError(ErrorCode.AccountNameUsed);
    }

    if (this.isExternalAccount(meta.originalHash as string)) {
      meta.isExternal = true;
    } else {
      // No need to keep it because when exporting internal account
      // `originalHash` will be automatically generated from mnemonic
      delete meta.originalHash;
    }

    meta.whenCreated = Date.now();

    try {
      this.#keyring.restoreAccount(backup, password);
      return await this.getAccount(address);
    } catch (e: any) {
      if (e.message === 'Unable to decode using the supplied passphrase') {
        throw new CoongError(ErrorCode.PasswordIncorrect);
      }

      throw e;
    }
  }

  /**
   * Export wallet with all created accounts & other information (accounts index, encrypted mnemonic)
   *
   * @param password
   */
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

  /**
   * Import a Qr backup & initializing keyring
   *
   * @param backup
   * @param password
   */
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

      this.#generateOriginalHash(rawMnemonic);

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

  async importBackup(backup: WalletBackup, password: string) {
    if (await this.initialized()) {
      throw new StandardCoongError('Wallet is already initialized');
    }

    try {
      const { encryptedMnemonic, accountsIndex } = backup;
      localStorage.setItem(ACCOUNTS_INDEX, accountsIndex.toString());
      localStorage.setItem(ENCRYPTED_MNEMONIC, encryptedMnemonic);

      const rawMnemonic = await this.#decryptMnemonic(password);
      if (!validateMnemonic(rawMnemonic)) {
        throw new CoongError(ErrorCode.InvalidMnemonic);
      }

      this.#generateOriginalHash(rawMnemonic);

      this.#keyring.restoreAccounts(backup, password);
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
