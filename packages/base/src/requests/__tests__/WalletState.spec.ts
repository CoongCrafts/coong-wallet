import { generateMnemonic } from '@polkadot/util-crypto/mnemonic/bip39';
import { newWalletRequest } from '@coong/base';
import WalletState, { AUTHORIZED_ACCOUNTS_KEY, AuthorizedApps } from '@coong/base/requests/WalletState';
import { WalletRequestMessage } from '@coong/base/types';
import Keyring from '@coong/keyring';
import { AccountInfo } from '@coong/keyring/types';
import { StandardCoongError } from '@coong/utils';
import { beforeEach, describe, expect, it } from 'vitest';

let state: WalletState;

beforeEach(async () => {
  if (state) {
    if (state.keyring) {
      await state.keyring.reset();
    }

    // @ts-ignore
    state = undefined;
  }

  localStorage.clear();

  await initWalletState();
});

const PASSWORD = 'supersecretpassword';
const MNEMONIC = generateMnemonic(12);

const initializeNewKeyring = async () => {
  const keyring = new Keyring();
  await keyring.initialize(MNEMONIC, PASSWORD);

  return keyring;
};
const initWalletState = async () => {
  const keyring = await initializeNewKeyring();
  state = new WalletState(keyring);
};

describe('extractAppId', () => {
  it('should raise error if url protocol is not supported', async () => {
    expect(() => state.extractAppId('ftp://example.com')).toThrowError(/Invalid url/);
  });

  it.each([
    { url: 'https://example.com/path', expected: 'example.com/path' },
    { url: 'http://example.com/path', expected: 'example.com/path' },
  ])('should return app id without url protocol ($url -> $expected)', async ({ url, expected }) => {
    expect(state.extractAppId(url)).toEqual(expected);
  });
});

describe('getAuthorizedApp', () => {
  it('should throw error if app has not been authorized', async () => {
    const randomAppUrl = 'https://random-app.com';
    expect(() => state.getAuthorizedApp(randomAppUrl)).toThrowError(
      new StandardCoongError(`The app at ${randomAppUrl} has not been authorized yet!`),
    );
  });

  it('should return app info is the app is authorized', async () => {
    const randomAppInfo = {
      name: 'Random App',
      url: 'https://random-app.com',
      authorizedAccounts: [],
    };

    const authorizedApps: AuthorizedApps = {
      'random-app.com': randomAppInfo,
    };

    localStorage.setItem(AUTHORIZED_ACCOUNTS_KEY, JSON.stringify(authorizedApps));
    state.reloadState();

    expect(state.getAuthorizedApp('https://random-app.com')).toEqual(randomAppInfo);
  });
});

describe('ensureAccountAuthorized', () => {
  const randomAppUrl = 'https://random-app.com';
  let account: AccountInfo;
  beforeEach(async () => {
    account = await state.keyring.createNewAccount('Account 01', PASSWORD);
  });

  it('should throw error if application is not authorized', async () => {
    expect(() => state.ensureAccountAuthorized(randomAppUrl, account.address)).toThrowError(
      new StandardCoongError(`The app at ${randomAppUrl} has not been authorized yet!`),
    );
  });

  it('should throw error if address is not authorized for the app', async () => {
    const randomAppInfo = {
      name: 'Random App',
      url: randomAppUrl,
      authorizedAccounts: [],
    };

    const authorizedApps: AuthorizedApps = {
      'random-app.com': randomAppInfo,
    };

    localStorage.setItem(AUTHORIZED_ACCOUNTS_KEY, JSON.stringify(authorizedApps));
    state.reloadState();

    expect(() => state.ensureAccountAuthorized(randomAppUrl, account.address)).toThrowError(
      new StandardCoongError(
        `The app at ${randomAppUrl} is not authorized to access account with address ${account.address}!`,
      ),
    );
  });

  it('should not throw anything if address is authorized for the app', async () => {
    const randomAppInfo = {
      name: 'Random App',
      url: randomAppUrl,
      authorizedAccounts: [account.address],
    };

    const authorizedApps: AuthorizedApps = {
      'random-app.com': randomAppInfo,
    };

    localStorage.setItem(AUTHORIZED_ACCOUNTS_KEY, JSON.stringify(authorizedApps));
    state.reloadState();

    expect(state.ensureAccountAuthorized(randomAppUrl, account.address)).toBeUndefined();
  });
});

describe('getCurrentRequestMessage', () => {
  it("should throw error if there's no current message", async () => {
    expect(() => state.getCurrentRequestMessage()).toThrowError(new StandardCoongError('No request message available'));
  });

  describe('with current message', () => {
    let currentMessage: WalletRequestMessage;
    beforeEach(() => {
      currentMessage = newWalletRequest({
        name: 'tab/requestAccess',
        body: {
          appName: 'Random App',
        },
      });
      state.newRequestMessage(currentMessage);
    });

    it('should throw error if request name does not match current message', async () => {
      expect(() => state.getCurrentRequestMessage('tab/signExtrinsic')).toThrowError(
        new StandardCoongError('Invalid request name'),
      );
    });

    it('should return current message', async () => {
      expect(state.getCurrentRequestMessage('tab/requestAccess')).toMatchObject(currentMessage);
    });
  });
});

describe.todo('approveRequestAccess', () => {
  // should throw error if no accounts are authorized
  // should merge new authorized accounts with existing authorized accounts
  // should persist new authorized app to storage
  // should resolve current request message
});

describe.todo('rejectRequestAccess', () => {
  // should reject current request message
});

describe.todo('approveSignExtrinsic', () => {
  // should throw error if password is not correct
  // should throw error is keypair is not existed
  // should resolve current request message with the signature
});

describe.todo('cancelSignExtrinsic', () => {
  // should reject current request message
});

describe.todo('newRequestMessage', () => {
  // should put new message to the
});

describe.todo('reset', () => {
  // should reset all persistent storage
});

describe.todo('reloadState', () => {
  // should reload persistent storage
});
