import { newUser, render, screen, UserEvent, waitFor } from '__tests__/testUtils';
import SettingsWalletButton from 'components/shared/settings/SettingsWalletButton';

export const expectSettingsWalletDialog = async (screen: any) => {
  await waitFor(() => {
    expect(screen.getByRole('button', { name: /Dark/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Light/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /System/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Close settings/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /English/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /5 minutes/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Backup Secret Recovery Phrase/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Change Wallet Password/ })).toBeInTheDocument();
  });
};

describe('SettingsWalletButton', () => {
  it('should hide the dialog by default', async () => {
    render(<SettingsWalletButton />, { preloadedState: { app: { seedReady: false, ready: true, locked: true } } });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  describe('when the dialog is open', () => {
    let user: UserEvent;
    beforeEach(async () => {
      user = newUser();

      render(<SettingsWalletButton />, {
        preloadedState: { app: { seedReady: true, ready: true, locked: false } },
      });

      const settingsButton = screen.getByTitle('Open settings');
      await user.click(settingsButton);
    });

    it('should active dark button and switch to dark theme when clicking on the dark mode button', async () => {
      const darkModeButton = await screen.findByRole('button', { name: /Dark/ });
      await user.click(darkModeButton);

      await waitFor(() => {
        expect(darkModeButton).toHaveClass('MuiButton-outlinedPrimary');
        expect(document.body.classList.contains('dark')).toBeTruthy();
      });
    });

    it("should the AutoLockSelection switch to '15 minutes' when choose 15 minutes", async () => {
      const autoLockSelectionButton = await screen.findByRole('button', { name: /5 minutes/ });
      await user.click(autoLockSelectionButton);

      const fifteenMinutesSelection = await screen.findByText(/15 minutes/);
      await user.click(fifteenMinutesSelection);

      expect(await screen.findByRole('button', { name: /15 minutes/ })).toBeInTheDocument();
    });

    it('should close the dialog when clicking the close button', async () => {
      const closeButton = await screen.findByTitle('Close settings');
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText('Settings')).not.toBeInTheDocument();
      });
    });

    it('should switch to BackupSecretPhraseDialog content when clicking on `Backup Secret Recovery Phrase` button', async () => {
      const BackupSecretRecoveryPhraseButton = await screen.findByRole('button', {
        name: /Backup Secret Recovery Phrase/,
      });

      await user.click(BackupSecretRecoveryPhraseButton);

      await waitFor(() => {
        expect(screen.getByText(/Backup Secret Recovery Phrase/)).toBeInTheDocument();
        expect(screen.getByText(/reveal the secret recovery phrase/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /View Secret Recovery Phrase/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Back/ })).toBeInTheDocument();
      });
    });

    it('should switch to ChangeWalletPasswordDialog content when clicking on `Change Wallet Password` button', async () => {
      const ChangeWalletPasswordButton = await screen.findByRole('button', { name: /Change Wallet Password/ });

      await user.click(ChangeWalletPasswordButton);

      await waitFor(() => {
        expect(screen.getByText(/Change Wallet Password/)).toBeInTheDocument();
        expect(screen.getByText(/Enter your wallet password to continue/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Continue/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Back/ })).toBeInTheDocument();
      });
    });

    it('should show `SettingsWalletDialog` content', async () => {
      expect(await screen.findByRole('dialog')).toBeInTheDocument();

      await expectSettingsWalletDialog(screen);
    });
  });

  describe('keyring not initialized', () => {
    it('should be hidden', () => {
      render(<SettingsWalletButton />, { preloadedState: { app: { seedReady: false, ready: true, locked: false } } });
      expect(screen.queryByTitle('Open settings')).not.toBeInTheDocument();
    });
  });

  describe('keyring initialized', () => {
    it('should be hidden if the wallet is locked', () => {
      render(<SettingsWalletButton />, { preloadedState: { app: { seedReady: true, ready: true, locked: true } } });
      expect(screen.queryByTitle('Open settings')).not.toBeInTheDocument();
    });
    it('should be visible if the wallet is unlocked', () => {
      render(<SettingsWalletButton />, { preloadedState: { app: { seedReady: true, ready: true, locked: false } } });
      expect(screen.queryByTitle('Open settings')).toBeInTheDocument();
    });
  });
});
