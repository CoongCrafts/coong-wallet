import { generateMnemonic } from '@polkadot/util-crypto/mnemonic/bip39';
import { newWalletRequest } from '@coong/base';
import WalletState, { AppInfo, AUTHORIZED_ACCOUNTS_KEY, AuthorizedApps } from '@coong/base/requests/WalletState';
import { AccessStatus, RequestName, WalletRequest, WalletRequestMessage, WalletResponse } from '@coong/base/types';
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

const setupAuthorizedApps = (authorizedAccounts: string[] = [], appUrl?: string) => {
  const randomAppUrl = appUrl || 'https://random-app.com';
  const randomAppId = randomAppUrl.split('//')[1];

  const randomAppInfo = {
    name: 'Random App',
    url: randomAppUrl,
    authorizedAccounts: authorizedAccounts,
  };

  const authorizedApps: AuthorizedApps = {
    [randomAppId]: randomAppInfo,
  };

  localStorage.setItem(AUTHORIZED_ACCOUNTS_KEY, JSON.stringify(authorizedApps));

  if (state) {
    state.reloadState();
  }

  return { randomAppUrl, randomAppInfo, authorizedApps };
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
    const { randomAppInfo, randomAppUrl } = setupAuthorizedApps();

    expect(state.getAuthorizedApp(randomAppUrl)).toEqual(randomAppInfo);
  });
});

describe('ensureAccountAuthorized', () => {
  let account: AccountInfo;
  beforeEach(async () => {
    account = await state.keyring.createNewAccount('Account 01', PASSWORD);
  });

  it('should throw error if application is not authorized', async () => {
    const randomAppUrl = 'https://random-app.com';
    expect(() => state.ensureAccountAuthorized(randomAppUrl, account.address)).toThrowError(
      new StandardCoongError(`The app at ${randomAppUrl} has not been authorized yet!`),
    );
  });

  it('should throw error if address is not authorized for the app', async () => {
    const { randomAppUrl } = setupAuthorizedApps();

    expect(() => state.ensureAccountAuthorized(randomAppUrl, account.address)).toThrowError(
      new StandardCoongError(
        `The app at ${randomAppUrl} is not authorized to access account with address ${account.address}!`,
      ),
    );
  });

  it('should not throw anything if address is authorized for the app', async () => {
    const { randomAppUrl } = setupAuthorizedApps([account.address]);

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

describe('approveRequestAccess', () => {
  it('should throw error if no accounts are authorized', () => {
    const currentMessage = newWalletRequest({
      name: 'tab/requestAccess',
      body: {
        appName: 'Random App',
      },
    });
    state.newRequestMessage(currentMessage);
    expect(() => state.approveRequestAccess([])).toThrow('Please choose at least one account to connect');
  });

  describe('with current message', () => {
    let account01: AccountInfo, currentWindowUrl: string, currentMessage: WalletRequestMessage;
    beforeEach(async () => {
      account01 = await state.keyring.createNewAccount('Account 01', PASSWORD);
      currentWindowUrl = window.location.origin;

      currentMessage = newWalletRequest({
        name: 'tab/requestAccess',
        body: {
          appName: 'Random App',
        },
      });
    });

    const handleRequestAccessApproval = async (authorizedAccounts: string[] = []) => {
      const [response, _] = await Promise.all([
        state.newRequestMessage(currentMessage),
        new Promise<void>((resolve) => {
          // Make sure the request is registered into the state before we can approve it
          setTimeout(() => {
            state.approveRequestAccess(authorizedAccounts);
            resolve();
          });
        }),
      ]);

      return response as WalletResponse<'tab/requestAccess'>;
    };

    it('should persist new authorized app to storage', async () => {
      await handleRequestAccessApproval([account01.address]);

      const authorizedApps = JSON.parse(localStorage.getItem(AUTHORIZED_ACCOUNTS_KEY) || '{}');
      const appInfo = authorizedApps[currentWindowUrl.split('//')[1]] as AppInfo;
      expect(state.getAuthorizedApp(currentWindowUrl)).toEqual(appInfo);
      expect(appInfo.url).toEqual(currentWindowUrl);
    });

    it('should resolve current request message', async () => {
      const response = await handleRequestAccessApproval([account01.address]);

      expect(response.result).toEqual(AccessStatus.APPROVED);
      expect(response.authorizedAccounts.sort()).toEqual([account01.address].sort());
    });

    it('should merge new authorized accounts with existing authorized accounts', async () => {
      setupAuthorizedApps([account01.address], currentWindowUrl);

      const account02 = await state.keyring.createNewAccount('Account 02', PASSWORD);
      const response = await handleRequestAccessApproval([account02.address]);

      expect(response.result).toEqual(AccessStatus.APPROVED);
      expect(response.authorizedAccounts.sort()).toEqual([account01.address, account02.address].sort());
    });

    it('should not merge duplicated authorized accounts to existing authorized accounts', async () => {
      setupAuthorizedApps([account01.address], currentWindowUrl);

      const response = await handleRequestAccessApproval([account01.address]);

      expect(response.result).toEqual(AccessStatus.APPROVED);
      expect(response.authorizedAccounts.sort()).toEqual([account01.address].sort());
    });
  });
});

describe('rejectRequestAccess', () => {
  it('should reject current request message', async () => {
    const currentMessage = newWalletRequest({
      name: 'tab/requestAccess',
      body: {
        appName: 'Random App',
      },
    });

    expect(
      Promise.all([
        state.newRequestMessage(currentMessage),
        new Promise<void>((resolve) => {
          // Make sure the request is registered into the state before we can approve it
          setTimeout(() => {
            state.rejectRequestAccess();
            resolve();
          });
        }),
      ]),
    ).rejects.toThrowError(new StandardCoongError(AccessStatus.DENIED));
  });
});

describe('approveSignExtrinsic', () => {
  it.todo('should throw error if password is not correct', () => {});
  it.todo('should throw error is keypair is not existed', () => {});
  it.todo('should resolve current request message with the signature', () => {});
});

describe('cancelSignExtrinsic', () => {
  it.todo('should reject current request message', () => {});
});
