import { UserEvent, initializeKeyring, newUser, render, screen, waitFor } from '__tests__/testUtils';
import { NewWalletScreenStep } from 'types';
import NewWallet from '../index';

const onWalletSetup = vi.fn(),
  onCancelSetup = vi.fn();

vi.mock('providers/WalletSetupProvider', async () => {
  const provider: any = await vi.importActual('providers/WalletSetupProvider');

  return {
    ...provider,
    useWalletSetup: () => ({
      onWalletSetup,
      onCancelSetup,
    }),
  };
});

vi.spyOn(window, 'prompt').mockImplementation(() => '');

beforeEach(() => {
  onWalletSetup.mockReset();
  onCancelSetup.mockReset();
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

    it('should trigger onWalletSetup callback', async () => {
      render(<NewWallet />);

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

      it('should render BackupWalletSelection after confirming the password', async () => {
        const passwordField = await screen.findByLabelText('Confirm wallet password');
        await user.type(passwordField, 'random-password');

        const nextButton = await screen.findByRole('button', { name: /Next/ });
        expect(nextButton).toBeEnabled();
        await user.click(nextButton);

        expect(await screen.findByText('Finally, back up your wallet')).toBeInTheDocument();
      });
    });

    describe('BackupWalletSelection', () => {
      beforeEach(() => {
        render(<NewWallet />, {
          preloadedState: {
            setupWallet: {
              password: 'password',
              newWalletScreenStep: NewWalletScreenStep.BackupWallet,
            },
          },
        });
      });

      const expectBackupWalletSelection = async (screen: any) => {
        expect(await screen.findByText('Finally, back up your wallet')).toBeInTheDocument();
        expect(await screen.findByText(/Choose a method to back up your wallet/)).toBeInTheDocument();
        expect(await screen.findByRole('button', { name: /Secret Recovery Phrase/ })).toBeInTheDocument();
        expect(await screen.findByRole('button', { name: /QR Code/ })).toBeInTheDocument();
        expect(await screen.findByRole('button', { name: /JSON File/ })).toBeInTheDocument();
        expect(await screen.findByRole('button', { name: /Back/ })).toBeInTheDocument();
      };

      it('should render the page correctly', async () => {
        await expectBackupWalletSelection(screen);
      });

      it('should go back to ChooseWalletPassword page', async () => {
        await user.click(await screen.findByRole('button', { name: /Back/ }));

        expect(await screen.findByText('First, choose your wallet password')).toBeInTheDocument();
      });

      it('should switch to BackupWallet screen', async () => {
        await user.click(await screen.findByRole('button', { name: /Secret Recovery Phrase/ }));

        expect(
          await screen.findByText(/Write down the below 12 words and keep it in a safe place./),
        ).toBeInTheDocument();
        expect(await screen.findByLabelText(/I have backed up my wallet/)).toBeInTheDocument();
        expect(await screen.findByRole('button', { name: /Finish/ })).toBeDisabled();
        expect(await screen.findByRole('button', { name: /Back/ })).toBeInTheDocument();
      });

      describe('BackupWallet', () => {
        beforeEach(async () => {
          await user.click(await screen.findByRole('button', { name: /Secret Recovery Phrase/ }));
        });

        it('should trigger onWalletSetup callback', async () => {
          await user.click(await screen.findByLabelText(/I have backed up my wallet/));
          await user.click(await screen.findByRole('button', { name: /Finish/ }));

          await waitFor(() => {
            expect(onWalletSetup).toBeCalled();
          });
        });

        it('should go back to BackupWalletSelection', async () => {
          await user.click(await screen.findByRole('button', { name: /Back/ }));

          await expectBackupWalletSelection(screen);
        });
      });
    });
  });
});
