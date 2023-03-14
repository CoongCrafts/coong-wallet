import { waitFor } from '@testing-library/react';
import { defaultNetwork, newWalletErrorResponse, newWalletRequest } from '@coong/base';
import { WalletRequestMessage } from '@coong/base/types';
import Keyring from '@coong/keyring';
import { AccountInfo } from '@coong/keyring/types';
import { SpyInstance } from '@vitest/spy';
import {
  initializeKeyring,
  newUser,
  PASSWORD,
  render,
  RouterWrapper,
  screen,
  setupAuthorizedApps,
  UserEvent,
} from '__tests__/testUtils';
import { Mock } from 'vitest';
import Request from '../../index';

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

describe('RequestTransactionApproval', () => {
  const preloadedState = { app: { seedReady: true, addressPrefix: defaultNetwork.prefix } };
  let windowClose: SpyInstance,
    postMessage: Mock,
    requestUrl: string,
    user: UserEvent,
    requestAccessMessage: WalletRequestMessage,
    account01: AccountInfo,
    keyring: Keyring;

  beforeEach(async () => {
    windowClose = vi.spyOn(window, 'close').mockImplementation(() => vi.fn());

    postMessage = vi.fn();
    window.opener = { postMessage };

    keyring = await initializeKeyring();
    account01 = await keyring.createNewAccount('Account 01', PASSWORD);

    requestAccessMessage = newWalletRequest({ name: 'tab/signExtrinsic', body: newPayload(account01.address) });
    const queryParam = new URLSearchParams({
      message: JSON.stringify(requestAccessMessage),
    }).toString();
    requestUrl = `/request?${queryParam}`;

    user = newUser();
  });

  describe('app is not authorized', () => {
    it('should reject request & close window', async () => {
      render(
        <RouterWrapper path='/request' currentUrl={requestUrl}>
          <Request />
        </RouterWrapper>,
        { preloadedState },
      );

      await waitFor(() => {
        const expectedResponse = newWalletErrorResponse(
          `The app at ${requestAccessMessage.origin} has not been authorized yet!`,
          requestAccessMessage.id,
        );
        expect(postMessage).toHaveBeenNthCalledWith(2, expectedResponse, requestAccessMessage.origin);
      });
    });
  });

  describe('app is authorized', () => {
    beforeEach(() => {
      setupAuthorizedApps([account01.address], window.location.origin);
    });

    it('should display the request correctly', async () => {
      render(
        <RouterWrapper path='/request' currentUrl={requestUrl}>
          <Request />
        </RouterWrapper>,
        { preloadedState },
      );

      expect(await screen.findByText(/Transaction Approval Request/)).toBeInTheDocument();
      expect(await screen.findByText(/You are approving a transaction with account/)).toBeInTheDocument();
      expect(await screen.findByText(/Account 01/)).toBeInTheDocument();
      expect(await screen.findByTestId('row-from')).toHaveTextContent(`from: ${window.location.origin}`);
      expect(await screen.findByTestId('row-method-data')).toHaveTextContent(
        // @ts-ignore
        `method data: ${requestAccessMessage.request.body.method}`,
      );

      expect(await screen.findByLabelText('Wallet password')).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: /Approve Transaction/ })).toBeDisabled();
      expect(await screen.findByRole('button', { name: /Cancel/ })).toBeEnabled();
    });

    it('should show error message for incorrect password', async () => {
      render(
        <RouterWrapper path='/request' currentUrl={requestUrl}>
          <Request />
        </RouterWrapper>,
        { preloadedState },
      );

      const passwordField = await screen.findByLabelText('Wallet password');
      await user.type(passwordField, 'incorrect-password');

      const approvalButton = await screen.findByRole('button', { name: /Approve Transaction/ });
      expect(approvalButton).toBeEnabled();
      await user.click(approvalButton);

      expect(await screen.findByText('PasswordIncorrect')).toBeInTheDocument();
    });

    it('should post back message and close window for correct password', async () => {
      render(
        <RouterWrapper path='/request' currentUrl={requestUrl}>
          <Request />
        </RouterWrapper>,
        { preloadedState },
      );

      const passwordField = await screen.findByLabelText('Wallet password');
      await user.type(passwordField, PASSWORD);

      const approvalButton = await screen.findByRole('button', { name: /Approve Transaction/ });
      expect(approvalButton).toBeEnabled();
      await user.click(approvalButton);

      await waitFor(() => {
        expect(postMessage).toHaveBeenCalledTimes(2); // 1: initialized signal, 2: signature message
      });
      expect(windowClose).toBeCalled();
    });

    it('should post back message and close window if cancelling', async () => {
      render(
        <RouterWrapper path='/request' currentUrl={requestUrl}>
          <Request />
        </RouterWrapper>,
        { preloadedState },
      );

      const cancelButton = await screen.findByRole('button', { name: /Cancel/ });
      expect(cancelButton).toBeEnabled();
      await user.click(cancelButton);

      await waitFor(() => {
        const expectedResponse = newWalletErrorResponse('Cancelled', requestAccessMessage.id);
        expect(postMessage).toHaveBeenNthCalledWith(2, expectedResponse, requestAccessMessage.origin);
      });
      expect(windowClose).toBeCalled();
    });
  });
});
