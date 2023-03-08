import { initializeKeyring, render, screen, waitFor } from '__tests__/testUtils';
import NewWallet from '../index';
import { NewWalletScreenStep } from '../types';

const navigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const reactRouter: any = await vi.importActual('react-router-dom');

  return { ...reactRouter, useNavigate: () => navigate };
});

beforeEach(() => {
  navigate.mockReset();
});

describe('NewWallet', () => {
  describe('keyring is initialized', () => {
    beforeEach(() => {
      initializeKeyring();
    });

    it('should navigate to homepage', async () => {
      render(<NewWallet />);

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('/');
      });
    });

    it('should trigger onWalletSetup callback', async () => {
      const onWalletSetup = vi.fn();
      render(<NewWallet onWalletSetup={onWalletSetup} />);

      await waitFor(() => {
        expect(onWalletSetup).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('keyring is not initialized', () => {
    it('should render ChooseWalletPassword view', async () => {
      render(<NewWallet />);
      expect(screen.queryByText('First, choose your wallet password')).toBeInTheDocument();
    });

    it('should render ConfirmWalletPassword view', async () => {
      render(<NewWallet />, {
        preloadedState: { setupWallet: { newWalletScreenStep: NewWalletScreenStep.ConfirmWalletPassword } },
      });
      expect(screen.queryByText('Next, confirm your wallet password')).toBeInTheDocument();
    });

    it('should render BackupSecretRecoveryPhrase view', async () => {
      render(<NewWallet />, {
        preloadedState: { setupWallet: { newWalletScreenStep: NewWalletScreenStep.BackupSecretRecoveryPhrase } },
      });
      expect(screen.queryByText('Finally, back up your secret recovery phrase')).toBeInTheDocument();
    });
  });
});
