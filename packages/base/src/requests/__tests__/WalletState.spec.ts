import { newWalletRequest } from '@coong/base';
import { AccessStatus, WalletRequestMessage, WalletResponse } from '@coong/base/types';
import { AccountInfo } from '@coong/keyring/types';
import { CoongError, ErrorCode, StandardCoongError } from '@coong/utils';
import { beforeEach, describe, expect, it } from 'vitest';
import WalletState, { AppInfo, AUTHORIZED_ACCOUNTS_KEY } from '../WalletState';
import { newWalletState, PASSWORD, setupAuthorizedApps } from './setup';

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

const initWalletState = async () => {
  state = await newWalletState();
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
    const { randomAppInfo, randomAppUrl } = setupAuthorizedApps(state);

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
    const { randomAppUrl } = setupAuthorizedApps(state);

    expect(() => state.ensureAccountAuthorized(randomAppUrl, account.address)).toThrowError(
      new StandardCoongError(
        `The app at ${randomAppUrl} is not authorized to access account with address ${account.address}!`,
      ),
    );
  });

  it('should not throw anything if address is authorized for the app', async () => {
    const { randomAppUrl } = setupAuthorizedApps(state, [account.address]);

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
          state.approveRequestAccess(authorizedAccounts);
          resolve();
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
      setupAuthorizedApps(state, [account01.address], currentWindowUrl);

      const account02 = await state.keyring.createNewAccount('Account 02', PASSWORD);
      const response = await handleRequestAccessApproval([account02.address]);

      expect(response.result).toEqual(AccessStatus.APPROVED);
      expect(response.authorizedAccounts.sort()).toEqual([account01.address, account02.address].sort());
    });

    it('should not merge duplicated authorized accounts to existing authorized accounts', async () => {
      setupAuthorizedApps(state, [account01.address], currentWindowUrl);

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

    await expect(
      Promise.all([
        state.newRequestMessage(currentMessage),
        new Promise<void>((resolve) => {
          state.rejectRequestAccess();
          resolve();
        }),
      ]),
    ).rejects.toThrowError(new StandardCoongError(AccessStatus.DENIED));
  });
});

describe('sign extrinsic', () => {
  let account01: AccountInfo;

  beforeEach(async () => {
    account01 = await state.keyring.createNewAccount('Account 01', PASSWORD);
  });

  const newSignExtrinsicRequest = (address: string) => {
    return newWalletRequest({
      name: 'tab/signExtrinsic',
      body: newPayload(address),
    });
  };

  const newPayload = (address: string) => {
    return {
      specVersion: '0x00002490',
      transactionVersion: '0x00000013',
      address,
      blockHash: '0x740c0ff582a5f5ed089a83afe396be64db42486397ee23611811e123a70bd63f',
      blockNumber: '0x00dd836d',
      era: '0xd502',
      genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
      method: '0x050000004769bbe59968882c1597ec1151621f0193547285125f1c1337371c013ff61f02890700',
      nonce: '0x00000000',
      signedExtensions: [
        'CheckNonZeroSender',
        'CheckSpecVersion',
        'CheckTxVersion',
        'CheckGenesis',
        'CheckMortality',
        'CheckNonce',
        'CheckWeight',
        'ChargeTransactionPayment',
        'PrevalidateAttests',
      ],
      tip: '0x00000000000000000000000000000000',
      version: 4,
    };
  };

  describe('approveSignExtrinsic', () => {
    const handleSignExtrinsicApproval = async (address: string, password: string) => {
      const message = newSignExtrinsicRequest(address);
      let [response, _] = await Promise.all([
        state.newRequestMessage(message),
        new Promise<void>(async (resolve, reject) => {
          try {
            await state.approveSignExtrinsic(password);
            resolve();
          } catch (e) {
            reject(e);
          }
        }),
      ]);

      response = response as WalletResponse<'tab/signExtrinsic'>;

      return {
        response,
        message,
      };
    };

    it('should throw error if password is not correct', async () => {
      await expect(handleSignExtrinsicApproval(account01.address, 'incorrect-password')).rejects.toThrowError(
        new CoongError(ErrorCode.PasswordIncorrect),
      );
    });

    it('should throw error is keypair is not existed', async () => {
      await expect(handleSignExtrinsicApproval('0xNotExistedAddress', PASSWORD)).rejects.toThrowError(
        new CoongError(ErrorCode.KeypairNotFound),
      );
    });

    it('should resolve current request message with the signature', async () => {
      const { response, message } = await handleSignExtrinsicApproval(account01.address, PASSWORD);
      expect(response.id).toEqual(message.id);
      expect(response.signature).toBeTypeOf('string');
    });
  });

  describe('cancelSignExtrinsic', () => {
    it('should reject current request message', async () => {
      const message = newSignExtrinsicRequest(account01.address);
      await expect(
        Promise.all([
          state.newRequestMessage(message),
          new Promise<void>((resolve) => {
            state.cancelSignExtrinsic();
            resolve();
          }),
        ]),
      ).rejects.toThrowError(new StandardCoongError('Cancelled'));
    });
  });
});
