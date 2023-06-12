import { generateMnemonic } from '@polkadot/util-crypto/mnemonic/bip39';
import { UserEvent, newUser, render, screen, waitFor } from '__tests__/testUtils';
import { RestoreWalletScreenStep } from 'types';
import ImportSecretRecoveryPhrase from '../index';

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

beforeEach(() => {
  onWalletSetup.mockReset();
  onCancelSetup.mockReset();
});

describe('ImportSecretRecoveryPhrase', () => {
  let user: UserEvent, randomSecretPhrase: string;
  beforeEach(() => {
    user = newUser();
    randomSecretPhrase = generateMnemonic(12);
  });

  describe('EnterSecretRecoveryPhrase', () => {
    beforeEach(() => {
      render(<ImportSecretRecoveryPhrase />);
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
      render(<ImportSecretRecoveryPhrase />, {
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
    beforeEach(() => {
      render(<ImportSecretRecoveryPhrase />, {
        preloadedState: {
          setupWallet: {
            password: 'random-password',
            secretPhrase: randomSecretPhrase,
            restoreWalletScreenStep: RestoreWalletScreenStep.ConfirmWalletPassword,
          },
        },
      });
    });

    it('should render the page correctly', async () => {
      expect(await screen.findByText('Lastly, confirm your wallet password')).toBeInTheDocument();

      const passwordField = await screen.findByLabelText('Confirm wallet password');
      expect(passwordField).toBeEnabled();
      expect(passwordField).toHaveFocus();

      expect(await screen.findByRole('button', { name: /Finish/ })).toBeDisabled();
      expect(await screen.findByRole('button', { name: /Back/ })).toBeEnabled();
    });

    it('should go back to ChooseWalletPassword', async () => {
      await user.click(await screen.findByRole('button', { name: /Back/ }));

      expect(await screen.findByText('Next, choose your wallet password')).toBeInTheDocument();
    });

    it('should show error message if password does not match', async () => {
      const passwordField = await screen.findByLabelText('Confirm wallet password');
      await user.type(passwordField, 'wrong-password');

      expect(await screen.findByText('Password does not match')).toBeInTheDocument();
    });

    it('should trigger onWalletSetup callback after confirming password', async () => {
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
