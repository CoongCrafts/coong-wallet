import { newWalletRequest } from '@coong/base';
import { RequestName } from '@coong/base/types';
import { CoongError, ErrorCode, StandardCoongError } from '@coong/utils';
import { beforeEach, describe, expect, it } from 'vitest';
import TabHandler from '../TabHandler';
import { newWalletState, PASSWORD, setupAuthorizedApps } from './setup';

let tabHandler: TabHandler, currentWindowOrigin: string;

const initTabHandler = async () => {
  const state = await newWalletState();
  tabHandler = new TabHandler(state);
};

beforeEach(async () => {
  if (tabHandler) {
    await tabHandler.state.keyring.reset();
  }

  localStorage.clear();

  await initTabHandler();
  currentWindowOrigin = window.location.origin;
});

describe('handle', () => {
  it('should throw error if request is not supported', async () => {
    const account01 = await tabHandler.state.keyring.createNewAccount('Account 01', PASSWORD);
    setupAuthorizedApps(tabHandler.state, [account01.address], currentWindowOrigin);

    await expect(
      tabHandler.handle(
        newWalletRequest({
          // @ts-ignore
          name: 'tab/unsupportedRequest',
          body: {},
        }),
      ),
    ).rejects.toThrowError(new CoongError(ErrorCode.UnknownRequest));
  });

  it.each(['tab/signRaw', 'tab/signExtrinsic'])(
    'should check for app authorization if request is `%s`',
    async (requestName) => {
      await expect(
        tabHandler.handle({
          ...newWalletRequest({
            name: requestName as RequestName,
            body: {},
          }),
          origin: currentWindowOrigin,
        }),
      ).rejects.toThrowError(new StandardCoongError(`The app at ${currentWindowOrigin} has not been authorized yet!`));
    },
  );

  it.each(['tab/signRaw', 'tab/signExtrinsic'])(
    'should throw error if the app is not authorized to access any accounts',
    async (requestName) => {
      const account01 = await tabHandler.state.keyring.createNewAccount('Account 01', PASSWORD);

      setupAuthorizedApps(tabHandler.state, [], currentWindowOrigin);

      await expect(
        tabHandler.handle({
          ...newWalletRequest({
            name: requestName as RequestName,
            // @ts-ignore
            body: {
              address: account01.address,
            },
          }),
          origin: currentWindowOrigin,
        }),
      ).rejects.toThrowError(
        new StandardCoongError(`The app at ${currentWindowOrigin} has not been authorized to access any accounts!`),
      );
    },
  );

  it('should not check for app authorization if request is tab/requestAccess', async () => {
    const account01 = await tabHandler.state.keyring.createNewAccount('Account 01', PASSWORD);
    await expect(
      Promise.all([
        tabHandler.handle({
          ...newWalletRequest({
            name: 'tab/requestAccess',
            body: {
              appName: 'Random name',
            },
          }),
          origin: currentWindowOrigin,
        }),
        new Promise<void>((resolve) => {
          tabHandler.state.approveRequestAccess([account01.address]);
          resolve();
        }),
      ]),
    ).resolves.toBeDefined();
  });

  it.each(['tab/signRaw', 'tab/signExtrinsic'])(
    'should throw error if the target address is not authorized to access by the app when perform signing',
    async (requestName) => {
      const account01 = await tabHandler.state.keyring.createNewAccount('Account 01', PASSWORD);
      const account02 = await tabHandler.state.keyring.createNewAccount('Account 02', PASSWORD);

      setupAuthorizedApps(tabHandler.state, [account01.address], currentWindowOrigin);

      await expect(
        tabHandler.handle({
          ...newWalletRequest({
            name: requestName as RequestName,
            // @ts-ignore
            body: {
              address: account02.address,
            },
          }),
          origin: currentWindowOrigin,
        }),
      ).rejects.toThrowError(
        new StandardCoongError(
          `The app at ${currentWindowOrigin} is not authorized to access account with address ${account02.address}!`,
        ),
      );
    },
  );

  it('should register the message to wallet state', () => {
    tabHandler.handle({
      ...newWalletRequest({
        name: 'tab/requestAccess',
        body: {
          appName: 'Random name',
        },
      }),
      origin: currentWindowOrigin,
    });

    expect(tabHandler.state.getCurrentRequestMessage('tab/requestAccess')).toBeTruthy();
  });
});
