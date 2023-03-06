import { InjectedAccount } from '@polkadot/extension-inject/types';
import { newWalletRequest } from '@coong/base';
import { WalletRequestMessage } from '@coong/base/types';
import { CoongError, ErrorCode, StandardCoongError } from '@coong/utils';
import { beforeEach, describe, expect, it } from 'vitest';
import { EmbedHandler } from '../EmbedHandler';
import { newWalletState, PASSWORD, setupAuthorizedApps } from './setup';

let embedHandler: EmbedHandler, currentWindowOrigin: string;

const initEmbedHandler = async () => {
  const state = await newWalletState();
  embedHandler = new EmbedHandler(state);
};

beforeEach(async () => {
  if (embedHandler) {
    await embedHandler.state.keyring.reset();
  }

  localStorage.clear();

  await initEmbedHandler();
  currentWindowOrigin = window.location.origin;
});

describe('handle', () => {
  it('should throw error if the request is unsupported', async () => {
    setupAuthorizedApps(embedHandler.state, [], currentWindowOrigin);
    await expect(
      embedHandler.handle(
        newWalletRequest({
          // @ts-ignore
          name: 'embed/unsupportedRequest',
          body: {},
        }),
      ),
    ).rejects.toThrowError(new CoongError(ErrorCode.UnknownRequest));
  });

  describe('embed/accessAuthorized', () => {
    let accessAuthorizedMessage: WalletRequestMessage;
    beforeEach(() => {
      accessAuthorizedMessage = newWalletRequest({
        name: 'embed/accessAuthorized',
        body: {
          appName: 'Random App',
        },
      });
    });

    it('should throw error if the app is not authorized', async () => {
      await expect(embedHandler.handle(accessAuthorizedMessage)).rejects.toThrowError(
        new StandardCoongError(`The app at ${currentWindowOrigin} has not been authorized yet!`),
      );
    });

    it('should return true if the app is authorized', async () => {
      const account01 = await embedHandler.state.keyring.createNewAccount('Account 01', PASSWORD);
      setupAuthorizedApps(embedHandler.state, [account01.address], currentWindowOrigin);
      await expect(embedHandler.handle(accessAuthorizedMessage)).resolves.toEqual(true);
    });
  });

  describe('embed/authorizedAccounts', () => {
    let authorizedAccountsMessage: WalletRequestMessage;
    beforeEach(() => {
      authorizedAccountsMessage = newWalletRequest({
        name: 'embed/authorizedAccounts',
        body: {},
      });
    });

    it('should throw error if the app is not authorized', async () => {
      await expect(embedHandler.handle(authorizedAccountsMessage)).rejects.toThrowError(
        new StandardCoongError(`The app at ${currentWindowOrigin} has not been authorized yet!`),
      );
    });

    it('should return the list of InjectedAccounts', async () => {
      const account01 = await embedHandler.state.keyring.createNewAccount('Account 01', PASSWORD);
      setupAuthorizedApps(embedHandler.state, [account01.address], currentWindowOrigin);
      const injectedAccounts = (await embedHandler.handle(authorizedAccountsMessage)) as InjectedAccount[];
      expect(injectedAccounts.length).toEqual(1);
      expect(injectedAccounts[0].address).toEqual(account01.address);
    });
  });
});
