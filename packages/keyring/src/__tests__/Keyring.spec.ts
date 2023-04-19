import { Keyring as InnerKeyring } from '@polkadot/ui-keyring/Keyring';
import { encodeAddress } from '@polkadot/util-crypto';
import { generateMnemonic } from '@polkadot/util-crypto/mnemonic/bip39';
import { AccountInfo } from '@coong/keyring/types';
import { CoongError, ErrorCode } from '@coong/utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Keyring, { ACCOUNTS_INDEX, ENCRYPTED_MNEMONIC } from '../Keyring';

let keyring: Keyring;

beforeEach(async () => {
  if (keyring) {
    // TODO better clearing cache data in modules
    await keyring.reset();

    // @ts-ignore
    keyring = undefined;
  }

  localStorage.clear();
});

const PASSWORD = 'supersecretpassword';
const MNEMONIC = generateMnemonic(12);

const initializeNewKeyring = async () => {
  keyring = new Keyring();
  await keyring.initialize(MNEMONIC, PASSWORD);

  return keyring;
};

describe('initialization', () => {
  it('should store mnemonic phrase to localstorage', async () => {
    await initializeNewKeyring();

    expect(localStorage.getItem(ENCRYPTED_MNEMONIC)).toBeDefined();
  });

  describe('initialized', () => {
    it('should return false before initialization', async () => {
      const keyring = new Keyring();

      expect(await keyring.initialized()).toEqual(false);
    });

    it('should return true after initialization', async () => {
      await initializeNewKeyring();

      expect(await keyring.initialized()).toEqual(true);
    });
  });
});

describe('lock/unlock', () => {
  beforeEach(async () => {
    await initializeNewKeyring();
  });

  it('should lock the keyring after initialization', async () => {
    expect(keyring.locked()).toEqual(true);
  });

  it('should unlock the keyring', async () => {
    await keyring.unlock(PASSWORD);

    expect(keyring.locked()).toEqual(false);
  });
});

describe('getAccountsIndex', () => {
  it('should start with 0', async () => {
    await initializeNewKeyring();
    expect(keyring.getAccountsIndex()).toEqual(0);
  });

  it('should increase one by one after new account created', async () => {
    await initializeNewKeyring();

    await keyring.createNewAccount('Account 01', PASSWORD);
    expect(keyring.getAccountsIndex()).toEqual(1);

    await keyring.createNewAccount('Account 02', PASSWORD);
    expect(keyring.getAccountsIndex()).toEqual(2);
  });
});

describe('verifyPassword', () => {
  it('should throw out error if wallet is not initialized', async () => {
    const keyring = new Keyring();

    await expect(keyring.verifyPassword(PASSWORD)).rejects.toThrowError(
      new CoongError(ErrorCode.KeyringNotInitialized),
    );
  });

  it('should throw out error if password is not correct', async () => {
    await initializeNewKeyring();

    await expect(keyring.verifyPassword('incorrect')).rejects.toThrowError(new CoongError(ErrorCode.PasswordIncorrect));
  });

  it('should not throw out anything if password is correct', async () => {
    await initializeNewKeyring();

    await expect(keyring.verifyPassword(PASSWORD)).resolves.toBeUndefined();
  });
});

// get accounts
describe('getAccounts', () => {
  it('should return empty array', async () => {
    const keyring = new Keyring();
    await expect(keyring.getAccounts()).resolves.toEqual([]);
  });

  it('should return accounts', async () => {
    await initializeNewKeyring();
    await keyring.createNewAccount('Account 01', PASSWORD);
    await keyring.createNewAccount('Account 02', PASSWORD);

    const accounts = await keyring.getAccounts();
    expect(accounts.length).toEqual(2);
    expect(accounts[0].name).toEqual('Account 01');
    expect(accounts[1].name).toEqual('Account 02');
  });
});

describe('createNewAccount', () => {
  describe('wallet initialized', () => {
    beforeEach(async () => {
      await initializeNewKeyring();
    });

    it('should required account name to create new account', async () => {
      await expect(keyring.createNewAccount('', PASSWORD)).rejects.toThrowError(
        new CoongError(ErrorCode.AccountNameRequired),
      );
    });

    it('should required password to create new account', async () => {
      await expect(keyring.createNewAccount('Account name', '')).rejects.toThrowError(
        new CoongError(ErrorCode.PasswordRequired),
      );
    });

    it('should throw out error if password is incorrect', async () => {
      await expect(keyring.createNewAccount('Account name', 'incorrect')).rejects.toThrowError(
        new CoongError(ErrorCode.PasswordIncorrect),
      );
    });

    it('should throw out error if name is already used', async () => {
      await keyring.createNewAccount('Account 01', PASSWORD);

      await expect(keyring.createNewAccount('Account 01', PASSWORD)).rejects.toThrowError(
        new CoongError(ErrorCode.AccountNameUsed),
      );
    });

    it('should have no derivation path for first account', async () => {
      const account = await keyring.createNewAccount('Account 01', PASSWORD);
      expect(account.derivationPath).toEqual('');
    });

    it('should save derivation path', async () => {
      await keyring.createNewAccount('Account 01', PASSWORD);
      const account02 = await keyring.createNewAccount('Account 02', PASSWORD);
      const account03 = await keyring.createNewAccount('Account 03', PASSWORD);
      expect(account02.derivationPath).toEqual('//0');
      expect(account03.derivationPath).toEqual('//1');
    });

    it('should lock the keyring after creation', async () => {
      await keyring.createNewAccount('Account 01', PASSWORD);
      expect(keyring.locked()).toEqual(true);
    });
  });

  describe('wallet uninitialized', () => {
    it('should throw out error', async () => {
      const keyring = new Keyring();
      await expect(keyring.createNewAccount('Account name', PASSWORD)).rejects.toThrowError(
        new CoongError(ErrorCode.KeyringNotInitialized),
      );
    });
  });
});

describe('getAccount', () => {
  let account: AccountInfo;
  beforeEach(async () => {
    await initializeNewKeyring();
    account = await keyring.createNewAccount('Account 01', PASSWORD);
  });

  it('should throw out error if account not found', async () => {
    await expect(keyring.getAccount('0xNotExistedAddress')).rejects.toThrowError(
      new CoongError(ErrorCode.AccountNotFound),
    );
  });

  it('should return account using generic address', async () => {
    await expect(keyring.getAccount(account.address)).resolves.toEqual(account);
  });

  it('should return account using different network address', async () => {
    const polkadotAddress = encodeAddress(account.address, 0);
    await expect(keyring.getAccount(polkadotAddress)).resolves.toEqual(account);

    const kusamaAddress = encodeAddress(account.address, 2);
    await expect(keyring.getAccount(kusamaAddress)).resolves.toEqual(account);
  });
});

describe('getAccountByName', () => {
  let account: AccountInfo;
  beforeEach(async () => {
    await initializeNewKeyring();
    account = await keyring.createNewAccount('Account 01', PASSWORD);
  });

  it('should throw out error if account not found', async () => {
    await expect(keyring.getAccountByName('NotExistedName')).rejects.toThrowError(
      new CoongError(ErrorCode.AccountNotFound),
    );
  });

  it('should return account for existed name', async () => {
    await expect(keyring.getAccountByName('Account 01')).resolves.toEqual(account);
  });
});

describe('getSigningPair', () => {
  let account: AccountInfo;
  beforeEach(async () => {
    await initializeNewKeyring();
    account = await keyring.createNewAccount('Account 01', PASSWORD);
  });

  it('should throw out error if keypair not found', () => {
    expect(() => keyring.getSigningPair('0xNotExistedAddress')).toThrowError(new CoongError(ErrorCode.KeypairNotFound));
  });

  it('should return keypair for existed address', () => {
    const pair = keyring.getSigningPair(account.address);
    expect(pair).toHaveProperty('address', account.address);
    expect(pair).toHaveProperty('sign');
    expect(pair).toHaveProperty('type');
  });
});

describe('existsName', () => {
  beforeEach(async () => {
    await initializeNewKeyring();
    await keyring.createNewAccount('Account 01', PASSWORD);
  });

  it('should return true if account exists', async () => {
    await expect(keyring.existsName('NotExistedName')).resolves.toEqual(false);
  });

  it('should return false if account not exists', async () => {
    await expect(keyring.existsName('Account 01')).resolves.toEqual(true);
  });
});

describe('reset', () => {
  it('should clear all keyring data after resetting', async () => {
    await initializeNewKeyring();

    await keyring.createNewAccount('Account 01', PASSWORD);
    await keyring.createNewAccount('Account 02', PASSWORD);
    await keyring.reset();

    expect(localStorage.getItem(ENCRYPTED_MNEMONIC)).toBeNull();
    expect(localStorage.getItem(ACCOUNTS_INDEX)).toBeNull();
    expect(Object.keys(localStorage).filter((key) => key.startsWith('account:0x')).length).toEqual(0);
  });
});

describe('changePassword', () => {
  const NEW_PASSWORD = 'valid-password';

  it('should throw out error if wallet is not initialized', async () => {
    const keyring = new Keyring();

    await expect(keyring.changePassword(PASSWORD, NEW_PASSWORD)).rejects.toThrowError(
      new CoongError(ErrorCode.KeyringNotInitialized),
    );
  });

  it('should throw out error if currentPassword is not correct', async () => {
    const keyring = await initializeNewKeyring();

    await expect(keyring.changePassword('incorrect-password', NEW_PASSWORD)).rejects.toThrowError(
      new CoongError(ErrorCode.PasswordIncorrect),
    );
  });

  it('should initialize the rawMnemonic with new password', async () => {
    const keyring = await initializeNewKeyring();

    const initializeSpy = vi.spyOn(Keyring.prototype, 'initialize');

    await keyring.changePassword(PASSWORD, NEW_PASSWORD);

    expect(initializeSpy).toHaveBeenCalledWith(MNEMONIC, NEW_PASSWORD);
  });

  it('should call `saveAccount` if currentPassword and newPassword is valid', async () => {
    const keyring = await initializeNewKeyring();

    await keyring.createNewAccount('account 0', PASSWORD);
    await keyring.createNewAccount('account 1', PASSWORD);

    const saveAccountSpy = vi.spyOn(InnerKeyring.prototype, 'saveAccount');
    await keyring.changePassword(PASSWORD, NEW_PASSWORD);

    expect(saveAccountSpy).toHaveBeenCalledTimes(2);
  });

  it('could use new password to unlock accounts after change password', async () => {
    const keyring = await initializeNewKeyring();

    await keyring.createNewAccount('test-account', PASSWORD);
    await keyring.changePassword(PASSWORD, NEW_PASSWORD);

    const testAccount = await keyring.getAccountByName('test-account');
    const testPair = await keyring.getSigningPair(testAccount.address);

    await expect(keyring.unlock(NEW_PASSWORD)).resolves;
    expect(testPair.unlock(NEW_PASSWORD)).toBeUndefined();
  });
});

describe('exportWallet', () => {
  beforeEach(async () => {
    await initializeNewKeyring();
  });

  it('should verify password', async () => {
    const mockedVerifyPassword = vi.spyOn(Keyring.prototype, 'verifyPassword');
    await keyring.exportWallet(PASSWORD);

    expect(mockedVerifyPassword).toHaveBeenCalledWith(PASSWORD);
  });

  it('should return a wallet backup', async () => {
    await keyring.createNewAccount('Account 01', PASSWORD);
    await keyring.createNewAccount('Account 02', PASSWORD);

    const backup = await keyring.exportWallet(PASSWORD);

    expect(backup.accounts).toHaveLength(2);
    expect(backup.accountsIndex).toEqual(2);
    expect(backup.encryptedMnemonic).toBeTypeOf('string');
  });
});
