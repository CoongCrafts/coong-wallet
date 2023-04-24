import { generateMnemonic } from '@polkadot/util-crypto/mnemonic/bip39';
import { UserEvent } from '@testing-library/user-event/setup/setup';
import { initializeKeyring, newUser, render, screen, waitFor } from '__tests__/testUtils';
import { RestoreWalletScreenStep } from 'types';
import RestoreWallet from '../index';

const navigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const reactRouter: any = await vi.importActual('react-router-dom');

  return { ...reactRouter, useNavigate: () => navigate };
});

beforeEach(() => {
  navigate.mockReset();
});

describe('RestoreWallet', () => {
  let user: UserEvent, randomSecretPhrase: string;
  beforeEach(() => {
    user = newUser();
    randomSecretPhrase = generateMnemonic(12);
  });

  describe('keyring is initialized', () => {
    beforeEach(() => {
      initializeKeyring();
    });

    it('should navigate to homepage', async () => {
      render(<RestoreWallet />);

      await waitFor(() => {
        expect(navigate).toHaveBeenCalledWith('/');
      });
    });

    it('should trigger onWalletSetup callback', async () => {
      const onWalletSetup = vi.fn();
      render(<RestoreWallet />);

      await waitFor(() => {
        expect(onWalletSetup).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('keyring is not initialized', () => {
    describe('EnterSecretRecoveryPhrase', () => {
      beforeEach(() => {
        render(<RestoreWallet />);
      });

      it('should render the page correctly', async () => {
        expect(await screen.findByText('First, enter your secret recovery phrase')).toBeInTheDocument();
        expect(await screen.findByRole('button', { name: /Next/ })).toBeDisabled();
      });

      it('should go to ChooseWalletPassword page', async () => {
        const secretPhraseField = await screen.findByLabelText('Secret recovery phrase');
        await user.type(secretPhraseField, randomSecretPhrase);

        await user.click(await screen.findByRole('button', { name: /Next/ }));

        expect(await screen.findByText('Next, choose your wallet password')).toBeInTheDocument();
      });

      it('should show error for invalid secret phrase', async () => {
        const secretPhraseField = await screen.findByLabelText('Secret recovery phrase');
        await user.type(secretPhraseField, 'randomly secret phrase');

        expect(await screen.findByText('Invalid secret recovery phrase')).toBeInTheDocument();
      });
    });

    describe('ChooseWalletPassword', () => {
      beforeEach(() => {
        render(<RestoreWallet />, {
          preloadedState: {
            setupWallet: {
              restoreWalletScreenStep: RestoreWalletScreenStep.ChooseWalletPassword,
            },
          },
        });
      });

      it('should render the page correctly', async () => {
        expect(await screen.findByText('Next, choose your wallet password')).toBeInTheDocument();
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

        expect(await screen.findByText('Lastly, confirm your wallet password')).toBeInTheDocument();
      });
    });

    describe('ConfirmWalletPassword', () => {
      const renderView = (onWalletSetup?: () => void) => {
        render(<RestoreWallet />, {
          preloadedState: {
            setupWallet: {
              password: 'random-password',
              secretPhrase: randomSecretPhrase,
              restoreWalletScreenStep: RestoreWalletScreenStep.ConfirmWalletPassword,
            },
          },
        });
      };

      it('should render the page correctly', async () => {
        renderView();
        expect(await screen.findByText('Lastly, confirm your wallet password')).toBeInTheDocument();

        const passwordField = await screen.findByLabelText('Confirm wallet password');
        expect(passwordField).toBeEnabled();
        expect(passwordField).toHaveFocus();

        expect(await screen.findByRole('button', { name: /Finish/ })).toBeDisabled();
        expect(await screen.findByRole('button', { name: /Back/ })).toBeEnabled();
      });

      it('should go back to ChooseWalletPassword', async () => {
        renderView();
        await user.click(await screen.findByRole('button', { name: /Back/ }));

        expect(await screen.findByText('Next, choose your wallet password')).toBeInTheDocument();
      });

      it('should show error message if password does not match', async () => {
        renderView();
        const passwordField = await screen.findByLabelText('Confirm wallet password');
        await user.type(passwordField, 'wrong-password');

        expect(await screen.findByText('Password does not match')).toBeInTheDocument();
      });

      it('should go to homepage(/) page after confirming the password', async () => {
        renderView();
        const passwordField = await screen.findByLabelText('Confirm wallet password');
        await user.type(passwordField, 'random-password');

        const finishButton = await screen.findByRole('button', { name: /Finish/ });
        expect(finishButton).toBeEnabled();
        await user.click(finishButton);

        await waitFor(() => {
          expect(navigate).toBeCalledWith('/');
        });
      });

      it('should trigger onWalletSetup callback after confirming password', async () => {
        const onWalletSetup = vi.fn();
        renderView(onWalletSetup);

        const passwordField = await screen.findByLabelText('Confirm wallet password');
        await user.type(passwordField, 'random-password');

        const finishButton = await screen.findByRole('button', { name: /Finish/ });
        expect(finishButton).toBeEnabled();
        await user.click(finishButton);

        await waitFor(() => {
          expect(onWalletSetup).toBeCalled();
        });
      });
    });
  });
});
