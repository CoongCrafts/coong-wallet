import { defaultNetwork } from '@coong/base';
import { initializeKeyring, newUser, PASSWORD, render, screen } from '__tests__/testUtils';
import { AutoLockTimerOptions } from 'components/shared/settings/SettingsWalletDialog/AutoLockSelection';
import MainScreen from '../MainScreen';

vi.mock('react-router-dom', async () => {
  const reactRouter: any = await vi.importActual('react-router-dom');

  return { ...reactRouter, useNavigate: () => vi.fn() };
});

vi.mock('react-use', async () => {
  const reactUse: any = await vi.importActual('react-use');

  return { ...reactUse, useIdle: () => true };
});

describe('MainScreen', () => {
  describe('keying is not initialized', () => {
    it('should render Welcome page by default', () => {
      render(<MainScreen />);
      expect(screen.queryByText('Welcome to Coong')).toBeInTheDocument();
    });
  });

  describe('keyring is initialized', () => {
    it('should render UnlockWallet page if wallet is locked', async () => {
      render(<MainScreen />, { preloadedState: { app: { seedReady: true, locked: true } } });
      expect(await screen.findByText('Unlock your wallet')).toBeInTheDocument();
    });

    it('should go to Accounts page after unlocking the wallet', async () => {
      await initializeKeyring();

      render(<MainScreen />, {
        preloadedState: { app: { seedReady: true, locked: true, addressPrefix: defaultNetwork.prefix } },
      });

      expect(await screen.findByText('Unlock your wallet')).toBeInTheDocument();
      const passwordField = await screen.findByLabelText('Wallet password');
      const unlockButton = await screen.findByRole('button', { name: /Unlock/ });

      const user = newUser();
      await user.type(passwordField, PASSWORD);
      await user.click(unlockButton);

      expect(await screen.findByText('Accounts')).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: /New Account/ })).toBeInTheDocument();
    });

    it('should render Accounts page if wallet is unlocked', async () => {
      render(<MainScreen />, {
        preloadedState: { app: { seedReady: true, locked: false, addressPrefix: defaultNetwork.prefix } },
      });

      expect(await screen.findByText('Accounts')).toBeInTheDocument();
    });

    it.each(AutoLockTimerOptions)(
      'should auto-lock the Wallet after passing the `autoLockInterval`: $label',
      async ({ interval }) => {
        vi.useFakeTimers();

        render(<MainScreen />, {
          preloadedState: {
            app: { seedReady: true, locked: false, addressPrefix: defaultNetwork.prefix },
            settings: { autoLockInterval: interval },
          },
        });

        vi.advanceTimersByTime(interval + 1e3);
        vi.useRealTimers();

        expect(await screen.findByText('Welcome back')).toBeInTheDocument();
        expect(await screen.findByText('Unlock your wallet')).toBeInTheDocument();
      },
    );
  });
});
