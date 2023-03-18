import { newWalletErrorResponse, newWalletRequest, newWalletResponse, WalletState } from '@coong/base';
import {
  waitFor,
  initializeKeyring,
  PASSWORD,
  render,
  RouterWrapper,
  screen,
  setupAuthorizedApps,
} from '__tests__/testUtils';
import { Mock } from 'vitest';
import Embed from '../Embed';

describe('Embed', () => {
  const renderView = () => {
    render(
      <RouterWrapper path='/embed'>
        <Embed />
      </RouterWrapper>,
    );
  };

  it('should render the page correctly', async () => {
    renderView();

    expect(await screen.findByText('Welcome to Coong Wallet!')).toBeInTheDocument();
    expect(await screen.findByText('This page should be loaded inside an iframe!')).toBeInTheDocument();
  });

  describe('not loaded inside iframe', () => {
    let addEventListener: Mock;
    beforeEach(() => {
      vi.spyOn(window, 'top', 'get').mockImplementation(() => null);

      addEventListener = vi.fn();
      vi.spyOn(window, 'addEventListener').mockImplementation(() => addEventListener);

      renderView();
    });

    it('should not send initialize signal', async () => {
      await waitFor(() => {
        expect(addEventListener).not.toBeCalled();
      });
    });
  });

  describe('loaded inside iframe', () => {
    let postMessage: Mock;
    beforeEach(() => {
      vi.restoreAllMocks();

      postMessage = vi.fn();
      vi.spyOn(window, 'self', 'get').mockImplementation(() => window);
      vi.spyOn(window, 'top', 'get').mockImplementation(() => ({ postMessage } as any));
    });

    it('should send initialized signal', async () => {
      renderView();
      expect(postMessage).toBeCalled();
    });

    const accessAuthorizedRequest = newWalletRequest({
      name: 'embed/accessAuthorized',
      body: {
        appName: 'Random Name',
      },
    });

    const authorizedAccountsRequest = newWalletRequest({
      name: 'embed/authorizedAccounts',
      body: {},
    });

    describe('dapp is authorized', () => {
      const tests = [
        {
          message: accessAuthorizedRequest,
          expected: newWalletErrorResponse(
            `The app at ${accessAuthorizedRequest.origin} has not been authorized yet!`,
            accessAuthorizedRequest.id,
          ),
        },
        {
          message: authorizedAccountsRequest,
          expected: newWalletErrorResponse(
            `The app at ${authorizedAccountsRequest.origin} has not been authorized yet!`,
            authorizedAccountsRequest.id,
          ),
        },
      ];

      it.each(tests)('should reject request $message.request.name', async ({ message, expected }) => {
        renderView();
        window.postMessage(message, window.location.origin);

        await waitFor(() => {
          expect(postMessage).toHaveBeenNthCalledWith(2, expected, '');
        });
      });
    });

    describe('dapp is authorized', () => {
      let state: WalletState;
      beforeEach(async () => {
        const keyring = await initializeKeyring();
        const account01 = await keyring.createNewAccount('Account 01', PASSWORD);
        state = new WalletState(keyring);

        setupAuthorizedApps([account01.address], window.location.origin);

        renderView();
      });

      it('should return true for embed/accessAuthorized', async () => {
        const message = newWalletRequest({
          name: 'embed/accessAuthorized',
          body: {
            appName: 'Random Name',
          },
        });
        window.postMessage(message, window.location.origin);

        await waitFor(() => {
          expect(postMessage).toHaveBeenNthCalledWith(2, newWalletResponse(true, message.id), '');
        });
      });

      it('should return authorized accounts for embed/authorizedAccounts', async () => {
        const message = newWalletRequest({
          name: 'embed/authorizedAccounts',
          body: {},
        });
        window.postMessage(message, window.location.origin);

        const expectedAccounts = (await state.getInjectedAccounts()).filter((one) => one.name === 'Account 01');

        await waitFor(() => {
          expect(postMessage).toHaveBeenNthCalledWith(2, newWalletResponse(expectedAccounts, message.id), '');
        });
      });
    });
  });
});
