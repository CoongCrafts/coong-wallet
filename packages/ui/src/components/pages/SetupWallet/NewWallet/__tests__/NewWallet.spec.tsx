import { UserEvent } from '@testing-library/user-event/setup/setup';
import { initializeKeyring, newUser, render, screen, waitFor } from '__tests__/testUtils';
import { NewWalletScreenStep } from 'types';
import NewWallet from '../index';

const navigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const reactRouter: any = await vi.importActual('react-router-dom');

  return { ...reactRouter, useNavigate: () => navigate };
});

beforeEach(() => {
  navigate.mockReset();
});

describe('NewWallet', () => {
  let user: UserEvent;
  beforeEach(() => {
    user = newUser();
  });

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
    describe('ChooseWalletPassword', () => {
      beforeEach(() => {
        render(<NewWallet />);
      });

      it('should render the page correctly', async () => {
        expect(await screen.findByText('First, choose your wallet password')).toBeInTheDocument();
        const passwordField = await screen.findByLabelText('Wallet password');
        expect(passwordField).toBeEnabled();
        expect(passwordField).toHaveFocus();

        expect(await screen.findByRole('button', { name: /Next/ })).toBeDisabled();
      });

      it('should show error message if password is less than 6 chars', async () => {
        const passwordField = await screen.findByLabelText('Wallet password');
        await user.type(passwordField, 'short');

        expect(await screen.findByRole('button', { name: /Next/ })).toBeDisabled();
        expect(await screen.findByText("Password's too short")).toBeInTheDocument();
      });

      it('should render ConfirmWalletPassword view after choosing password', async () => {
        const passwordField = await screen.findByLabelText('Wallet password');
        await user.type(passwordField, 'valid-password');

        const nextButton = await screen.findByRole('button', { name: /Next/ });
        expect(nextButton).toBeEnabled();
        await user.click(nextButton);

        expect(await screen.findByText('Next, confirm your wallet password')).toBeInTheDocument();
      });
    });

    describe('ConfirmWalletPassword', () => {
      beforeEach(() => {
        render(<NewWallet />, {
          preloadedState: {
            setupWallet: {
              password: 'random-password',
              newWalletScreenStep: NewWalletScreenStep.ConfirmWalletPassword,
            },
          },
        });
      });

      it('should render the page correctly', async () => {
        expect(await screen.findByText('Next, confirm your wallet password')).toBeInTheDocument();

        const passwordField = await screen.findByLabelText('Confirm wallet password');
        expect(passwordField).toBeEnabled();
        expect(passwordField).toHaveFocus();

        expect(await screen.findByRole('button', { name: /Next/ })).toBeDisabled();
        expect(await screen.findByRole('button', { name: /Back/ })).toBeEnabled();
      });

      it('should go back to ChooseWalletPassword', async () => {
        await user.click(await screen.findByRole('button', { name: /Back/ }));

        expect(await screen.findByText('First, choose your wallet password')).toBeInTheDocument();
      });

      it('should show error message if password does not match', async () => {
        const passwordField = await screen.findByLabelText('Confirm wallet password');
        await user.type(passwordField, 'wrong-password');

        expect(await screen.findByText('Password does not match')).toBeInTheDocument();
      });

      it('should render BackupSecretRecoveryPhrase after confirming the password', async () => {
        const passwordField = await screen.findByLabelText('Confirm wallet password');
        await user.type(passwordField, 'random-password');

        const nextButton = await screen.findByRole('button', { name: /Next/ });
        expect(nextButton).toBeEnabled();
        await user.click(nextButton);

        expect(await screen.findByText('Finally, back up your secret recovery phrase')).toBeInTheDocument();
      });
    });

    describe('BackupSecretRecoveryPhrase', () => {
      const renderView = (onWalletSetup?: () => void) => {
        render(<NewWallet onWalletSetup={onWalletSetup} />, {
          preloadedState: {
            setupWallet: {
              password: 'password',
              newWalletScreenStep: NewWalletScreenStep.BackupSecretRecoveryPhrase,
            },
          },
        });
      };

      it('should render the page correctly', async () => {
        renderView();
        expect(await screen.findByText('Finally, back up your secret recovery phrase')).toBeInTheDocument();
        expect(await screen.findByLabelText(/I have backed up my recovery phrase/)).toBeInTheDocument();
        expect(await screen.findByRole('button', { name: /Finish/ })).toBeDisabled();
        expect(await screen.findByRole('button', { name: /Back/ })).toBeInTheDocument();
      });

      it('should go back to ChooseWalletPassword page', async () => {
        renderView();
        await user.click(await screen.findByRole('button', { name: /Back/ }));

        expect(await screen.findByText('First, choose your wallet password')).toBeInTheDocument();
      });

      it('should go to homepage(/) page after confirm backup', async () => {
        renderView();
        await user.click(await screen.findByLabelText(/I have backed up my recovery phrase/));
        await user.click(await screen.findByRole('button', { name: /Finish/ }));

        await waitFor(() => {
          expect(navigate).toBeCalledWith('/');
        });
      });

      it('should trigger onWalletSetup callback', async () => {
        const onWalletSetup = vi.fn();
        renderView(onWalletSetup);

        await user.click(await screen.findByLabelText(/I have backed up my recovery phrase/));
        await user.click(await screen.findByRole('button', { name: /Finish/ }));

        await waitFor(() => {
          expect(onWalletSetup).toBeCalled();
        });
      });
    });
  });
});
